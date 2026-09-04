import React, { useState, useEffect } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  Wrench,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  Shield,
  Phone,
  Building,
  Lock,
  RotateCcw,
  Printer,
  ChevronRight,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'SuperAdmin HQ' | 'Facility Engineer' | 'Soldier Landlord' | 'Resident Tenant';
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface MaintenanceTicket {
  id: string;
  flatCode: string;
  laneNumber: number;
  requesterName: string;
  requesterRole: 'Soldier Owner' | 'Civilian Tenant';
  requesterPhone: string;
  category: 'Plumbing & Borehole' | 'Electrical & Transformer' | 'Solar Streetlighting' | 'Drainage & Sanitation' | 'Structural / Roof';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  reportedDate: string;
  resolvedDate?: string;
  messages: ChatMessage[];
}

const DEFAULT_TICKETS: MaintenanceTicket[] = [
  {
    id: 'MNT-2026-001',
    flatCode: 'L1H4B',
    laneNumber: 1,
    requesterName: 'Staff Sgt. Adamu Mohammed',
    requesterRole: 'Soldier Owner',
    requesterPhone: '+234 803 111 2233',
    category: 'Plumbing & Borehole',
    title: 'Main water borehole booster pump line pressure drop',
    description: 'Booster pump 2 pressure is insufficient for upper floor flats in House 4. Low water pressure since yesterday morning.',
    priority: 'high',
    status: 'in_progress',
    reportedDate: '2026-08-30 08:15',
    messages: [
      {
        id: 'msg-1',
        senderName: 'Staff Sgt. Adamu Mohammed',
        senderRole: 'Soldier Owner',
        message: 'Good morning HQ. Water pressure on the top floor of House 4 has dropped drastically. Please send a plumber to inspect booster pump 2.',
        timestamp: '2026-08-30 08:15',
        isAdmin: false,
      },
      {
        id: 'msg-2',
        senderName: 'Engr. Kabiru Musa',
        senderRole: 'Facility Engineer',
        message: 'Acknowledged, Sergeant. We dispatched the mechanical team to inspect the check valve and pressure regulator.',
        timestamp: '2026-08-30 09:40',
        isAdmin: true,
      },
      {
        id: 'msg-3',
        senderName: 'SuperAdmin HQ Command',
        senderRole: 'SuperAdmin HQ',
        message: 'Replacement 2.5HP submersible check valve acquired. Technicians are currently on site completing the repair.',
        timestamp: '2026-08-30 11:20',
        isAdmin: true,
      },
    ],
  },
  {
    id: 'MNT-2026-002',
    flatCode: 'L3H2A',
    laneNumber: 3,
    requesterName: 'Engr. Emeka Gabriel Okon',
    requesterRole: 'Civilian Tenant',
    requesterPhone: '+234 803 456 7890',
    category: 'Solar Streetlighting',
    title: 'Lane 3 Pole #4 solar inverter and battery replacement',
    description: 'Streetlight pole 4 fails to illuminate after 20:00hrs, causing a dark zone near the Lane 3 corner turn.',
    priority: 'medium',
    status: 'resolved',
    reportedDate: '2026-08-25 19:30',
    resolvedDate: '2026-08-27 14:00',
    messages: [
      {
        id: 'msg-201',
        senderName: 'Engr. Emeka Gabriel Okon',
        senderRole: 'Resident Tenant',
        message: 'Hello Admin, streetlight pole 4 at the Lane 3 junction is completely dark at night. Potential security blindspot.',
        timestamp: '2026-08-25 19:30',
        isAdmin: false,
      },
      {
        id: 'msg-202',
        senderName: 'Facility Operations',
        senderRole: 'Facility Engineer',
        message: 'Inspection completed. Solar lithium cell was faulty. Replaced with new 150Ah solar battery and 60W LED luminaire.',
        timestamp: '2026-08-27 13:45',
        isAdmin: true,
      },
      {
        id: 'msg-203',
        senderName: 'Engr. Emeka Gabriel Okon',
        senderRole: 'Resident Tenant',
        message: 'Confirmed working brightly tonight! Thank you for the swift response.',
        timestamp: '2026-08-27 20:10',
        isAdmin: false,
      },
    ],
  },
  {
    id: 'MNT-2026-003',
    flatCode: 'L5H1C',
    laneNumber: 5,
    requesterName: 'Dr. (Mrs) Fatima Abubakar',
    requesterRole: 'Civilian Tenant',
    requesterPhone: '+234 802 112 3344',
    category: 'Drainage & Sanitation',
    title: 'Perimeter concrete drainage desilting at Lane 5 entrance',
    description: 'Heavy rainfall yesterday caused sediment accumulation in the roadside storm drain. Needs desilting.',
    priority: 'low',
    status: 'open',
    reportedDate: '2026-09-01 10:00',
    messages: [
      {
        id: 'msg-301',
        senderName: 'Dr. Fatima Abubakar',
        senderRole: 'Resident Tenant',
        message: 'Good day. Requesting sanitation crew to desilt the storm drain in front of House 1 Lane 5 to prevent waterlogging.',
        timestamp: '2026-09-01 10:00',
        isAdmin: false,
      },
    ],
  },
];

export const MaintenancePage: React.FC = () => {
  const store = usePhdlStore();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('phdl_maintenance_tickets_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_TICKETS;
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || 'MNT-2026-001');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Ticket Form State
  const [newFlat, setNewFlat] = useState('L1H1A');
  const [newRequester, setNewRequester] = useState('Staff Sgt. Adamu Mohammed');
  const [newPhone, setNewPhone] = useState('+234 803 111 2233');
  const [newRole, setNewRole] = useState<'Soldier Owner' | 'Civilian Tenant'>('Soldier Owner');
  const [newCategory, setNewCategory] = useState<MaintenanceTicket['category']>('Plumbing & Borehole');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<MaintenanceTicket['priority']>('medium');

  useEffect(() => {
    localStorage.setItem('phdl_maintenance_tickets_v3', JSON.stringify(tickets));
  }, [tickets]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // Send Feedback Reply in Thread
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'SuperAdmin HQ Command',
      senderRole: 'SuperAdmin HQ',
      message: replyText.trim(),
      timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      isAdmin: true,
    };

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'open' ? ('in_progress' as const) : t.status,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setTickets(updated);
    setReplyText('');
    setNotice(`Feedback sent to ${selectedTicket.requesterName} (Flat ${selectedTicket.flatCode})!`);
    setTimeout(() => setNotice(null), 3500);
  };

  // Close / Resolve Ticket
  const handleToggleResolveTicket = (ticketId: string, toResolve: boolean) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const closingMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderName: 'SuperAdmin HQ Command',
          senderRole: 'SuperAdmin HQ',
          message: toResolve
            ? '✅ [TICKET CLOSED]: Facility engineers have completed this work order and verified operation with the resident.'
            : '🔄 [TICKET REOPENED]: Work order has been reactivated for follow-up inspection.',
          timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          isAdmin: true,
        };

        return {
          ...t,
          status: (toResolve ? 'resolved' : 'in_progress') as MaintenanceTicket['status'],
          resolvedDate: toResolve ? new Date().toISOString().split('T')[0] : undefined,
          messages: [...t.messages, closingMsg],
        };
      }
      return t;
    });

    setTickets(updated);
    setNotice(toResolve ? `Ticket ${ticketId} has been resolved & closed!` : `Ticket ${ticketId} reopened.`);
    setTimeout(() => setNotice(null), 3500);
  };

  // Create New Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const laneNum = Number(newFlat.match(/\d+/)?.[0]) || 1;
    const newId = `MNT-2026-${(tickets.length + 1).toString().padStart(3, '0')}`;

    const newTicket: MaintenanceTicket = {
      id: newId,
      flatCode: newFlat.toUpperCase(),
      laneNumber: laneNum,
      requesterName: newRequester,
      requesterRole: newRole,
      requesterPhone: newPhone,
      category: newCategory,
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'open',
      reportedDate: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: newRequester,
          senderRole: newRole === 'Soldier Owner' ? 'Soldier Landlord' : 'Resident Tenant',
          message: newDesc,
          timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          isAdmin: false,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newId);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewDesc('');
    setNotice(`New maintenance ticket ${newId} logged successfully!`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredTickets = tickets.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const mFlat = t.flatCode.toLowerCase().includes(q);
      const mName = t.requesterName.toLowerCase().includes(q);
      const mTitle = t.title.toLowerCase().includes(q);
      const mId = t.id.toLowerCase().includes(q);
      if (!mFlat && !mName && !mTitle && !mId) return false;
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>ESTATE INFRASTRUCTURE SLA</span> • <span>REAL-TIME RESIDENT FEEDBACK</span>
          </div>
          <h1>Maintenance & Infrastructure Requests</h1>
          <p>
            Track work orders, dispatch facility engineering crews, and communicate directly with landlords/tenants through live resolution chat threads.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
          >
            <Plus size={14} /> Log New Request
          </button>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Printer size={14} /> Print SLA Report
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Flat Code, Resident Name, or Issue summary..."
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">-- All Statuses ({tickets.length}) --</option>
              <option value="open">Open Requests</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved & Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Split Screen: Tickets List & Live Chat Thread */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(400px, 1.8fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT COLUMN: TICKET QUEUE */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#F8FAFC', fontWeight: 800, fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
            Maintenance Queue ({filteredTickets.length})
          </div>

          <div style={{ maxHeight: '68vh', overflowY: 'auto' }}>
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--army-green-50)' : '#FFFFFF',
                    borderLeft: isSelected ? '4px solid var(--army-green-800)' : '4px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.78rem', color: 'var(--army-green-950)' }}>
                        {t.id}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1E293B' }}>
                        • Flat {t.flatCode}
                      </span>
                    </div>

                    <span
                      className={`badge ${
                        t.status === 'resolved'
                          ? 'badge-success'
                          : t.status === 'in_progress'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                      style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}
                    >
                      {t.status === 'resolved' ? '✓ Closed' : t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--army-green-950)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {t.title}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>{t.requesterName}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MessageSquare size={12} /> {t.messages.length} replies
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED TICKET DETAILS & INTERACTIVE CHAT THREAD */}
        {selectedTicket ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '68vh', overflow: 'hidden' }}>
            {/* Ticket Header & Status Controls */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.82rem', color: 'var(--army-green-800)' }}>
                      {selectedTicket.id}
                    </span>
                    <span className="badge badge-military">{selectedTicket.category}</span>
                    <span className={`badge ${selectedTicket.priority === 'high' ? 'badge-danger' : selectedTicket.priority === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                      {selectedTicket.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--army-green-950)', fontSize: '1.05rem' }}>
                    {selectedTicket.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>Requester:</strong> {selectedTicket.requesterName} ({selectedTicket.requesterRole}) • <strong>Flat {selectedTicket.flatCode} (Lane {selectedTicket.laneNumber})</strong> • 📞 {selectedTicket.requesterPhone}
                  </div>
                </div>

                {/* Close / Reopen Action Button */}
                {selectedTicket.status !== 'resolved' ? (
                  <button
                    type="button"
                    onClick={() => handleToggleResolveTicket(selectedTicket.id, true)}
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: '#15803D', gap: '0.35rem', fontWeight: 800 }}
                  >
                    <CheckCircle2 size={14} /> Resolve & Close Ticket
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleResolveTicket(selectedTicket.id, false)}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.35rem', borderColor: '#F59E0B', color: '#B45309' }}
                  >
                    <RotateCcw size={14} /> Re-open Ticket
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Chat Messages Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#FFFFFF' }}>
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isAdmin ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isAdmin ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <strong>{msg.senderName}</strong>
                    <span style={{ fontSize: '0.68rem', backgroundColor: msg.isAdmin ? '#DCFCE7' : '#EFF6FF', color: msg.isAdmin ? '#15803D' : '#1D4ED8', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 700 }}>
                      {msg.senderRole}
                    </span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: msg.isAdmin ? '10px 10px 0 10px' : '10px 10px 10px 0',
                      backgroundColor: msg.isAdmin ? '#1B4D21' : '#F1F5F9',
                      color: msg.isAdmin ? '#FFFFFF' : '#0F172A',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Reply Composer */}
            {selectedTicket.status !== 'resolved' ? (
              <form
                onSubmit={handleSendReply}
                style={{
                  padding: '0.85rem 1rem',
                  borderTop: '1px solid var(--border-light)',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send feedback or update to ${selectedTicket.requesterName}...`}
                  className="form-control"
                  style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#1B4D21', gap: '0.4rem', padding: '0.5rem 1rem' }}
                >
                  <Send size={14} /> Send Feedback
                </button>
              </form>
            ) : (
              <div style={{ padding: '0.85rem', backgroundColor: '#F0FDF4', borderTop: '1px solid #BBF7D0', textAlign: 'center', fontSize: '0.82rem', color: '#166534', fontWeight: 700 }}>
                ✓ This maintenance ticket was marked as resolved on {selectedTicket.resolvedDate || 'recent date'}. Conversation thread is archived.
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Select a maintenance ticket from the left queue to view details and feedback thread.
          </div>
        )}
      </div>

      {/* 4. LOG NEW MAINTENANCE REQUEST MODAL */}
      {isCreatingNew && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Log New Maintenance & Infrastructure Request</h3>
              <button onClick={() => setIsCreatingNew(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Flat Code:</label>
                  <input type="text" value={newFlat} onChange={(e) => setNewFlat(e.target.value)} placeholder="e.g. L1H1A, L3H4C" className="form-control" required />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Resident Role:</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="form-select">
                    <option value="Soldier Owner">🪖 Soldier Owner</option>
                    <option value="Civilian Tenant">🏠 Civilian Tenant</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Requester Full Name:</label>
                  <input type="text" value={newRequester} onChange={(e) => setNewRequester(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number:</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="form-control" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Infrastructure Category:</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="form-select">
                    <option value="Plumbing & Borehole">🚰 Plumbing & Water Borehole</option>
                    <option value="Electrical & Transformer">⚡ Electrical Substation & Power</option>
                    <option value="Solar Streetlighting">💡 Solar Streetlighting</option>
                    <option value="Drainage & Sanitation">🧹 Drainage & Sanitation</option>
                    <option value="Structural / Roof">🏢 Civil & Roof Maintenance</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Priority Level:</label>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as any)} className="form-select">
                    <option value="high">🔴 High (Emergency)</option>
                    <option value="medium">🟡 Medium (Standard SLA)</option>
                    <option value="low">🟢 Low (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Issue Summary / Title:</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Borehole pressure fault in Lane 1 House 4" className="form-control" required />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Detailed Description / Initial Feedback:</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} placeholder="Describe the maintenance requirement..." className="form-control" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsCreatingNew(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#15803D' }}>Log Work Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;