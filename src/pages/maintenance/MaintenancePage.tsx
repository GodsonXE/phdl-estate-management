import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenanceSeverity,
  MaintenanceRouting,
  MaintenanceStatus,
} from '../../types';
import {
  Wrench,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Zap,
  Shield,
  Droplets,
  HardHat,
  Eye,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  formatNaira,
  getStatusBadgeClass,
  getStatusLabel,
} from '../../utils/formatters';
import { exportGenericToCSV } from '../../utils/exportUtils';

export const MaintenancePage: React.FC = () => {
  const store = usePhdlStore();
  const currentRole = store.getActiveRole();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const flats = store.getFlats(currentEstateId);
  const activeSoldier = store.getSoldierById(store.getActiveSoldierId());
  const activeTenant = store.getTenantById(store.getActiveTenantId());
  const allTickets = store.getMaintenanceRequests(currentEstateId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedRouting, setSelectedRouting] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New Ticket Form
  const [ticketCategory, setTicketCategory] = useState<MaintenanceCategory>('plumbing');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSeverity, setTicketSeverity] = useState<MaintenanceSeverity>('medium');
  const [ticketFlatId, setTicketFlatId] = useState<string>(
    currentRole === 'tenant'
      ? activeTenant?.flatId || 'flat-2'
      : currentRole === 'soldier'
      ? activeSoldier?.ownedFlatIds[0] || 'flat-1'
      : flats[0]?.id || 'flat-1'
  );

  // Technician resolution state in modal
  const [technicianName, setTechnicianName] = useState('');
  const [technicianPhone, setTechnicianPhone] = useState('');
  const [costEstimate, setCostEstimate] = useState<number>(10000);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Role scoping
  const visibleTickets = allTickets.filter((ticket) => {
    if (currentRole === 'tenant' && activeTenant) {
      return ticket.flatId === activeTenant.flatId || ticket.raisedById === activeTenant.id;
    }
    if (currentRole === 'soldier' && activeSoldier) {
      return (
        activeSoldier.ownedFlatIds.includes(ticket.flatId) ||
        ticket.routingTarget === 'landlord' ||
        ticket.raisedById === activeSoldier.id
      );
    }
    return true; // PHDL Admin sees all
  });

  const filteredTickets = visibleTickets.filter((ticket) => {
    if (selectedCategory !== 'all' && ticket.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && ticket.status !== selectedStatus) return false;
    if (selectedSeverity !== 'all' && ticket.severity !== selectedSeverity) return false;
    if (selectedRouting !== 'all' && ticket.routingTarget !== selectedRouting) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (ticket.ticketNumber || ticket.id).toLowerCase().includes(q) ||
        ticket.title.toLowerCase().includes(q) ||
        (ticket.flatCode || '').toLowerCase().includes(q) ||
        (ticket.raisedByName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Ticket Number',
      'Flat Code',
      'Category',
      'Title',
      'Severity',
      'Routing Target',
      'Raised By Role',
      'Raised By Name',
      'Status',
      'Created Date',
    ];

    const rows = filteredTickets.map((t) => [
      t.ticketNumber || t.id,
      t.flatCode || '',
      t.category.replace(/_/g, ' ').toUpperCase(),
      t.title,
      (t.severity || 'low').toUpperCase(),
      t.routingTarget === 'phdl_estate_manager' ? 'PHDL Management' : 'Landlord',
      (t.raisedByRole || 'resident').toUpperCase(),
      t.raisedByName || 'Resident',
      getStatusLabel(t.status),
      formatDate(t.createdAt),
    ]);

    exportGenericToCSV(headers, rows, `PHDL_Maintenance_Tickets_${Date.now()}.csv`);
    setNoticeMessage(`Exported ${rows.length} tickets to CSV.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const flat = flats.find((f) => f.id === ticketFlatId) || flats[0];

    // Smart Routing Logic:
    // Structural/central grid/drainage/security -> PHDL Estate Manager
    // Plumbing/internal wiring/noise -> Soldier Landlord
    let routing: MaintenanceRouting = 'landlord';
    if (
      ticketCategory === 'structural_roofing' ||
      ticketCategory === 'civil_drainage' ||
      ticketCategory === 'security' ||
      ticketCategory === 'water_supply' ||
      ticketSeverity === 'emergency'
    ) {
      routing = 'phdl_estate_manager';
    }

    const raisedByName =
      currentRole === 'soldier'
        ? `${activeSoldier?.rank} ${activeSoldier?.fullName}`
        : currentRole === 'tenant'
        ? activeTenant?.fullName || 'Resident Tenant'
        : 'Estate Inspector';

    const raisedByPhone =
      currentRole === 'soldier'
        ? activeSoldier?.phone || '+234 800 000 0000'
        : activeTenant?.phone || '+234 800 000 0000';

    const tNum = `MNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newReq: MaintenanceRequest = {
      id: `mnt-${Date.now()}`,
      ticketNumber: tNum,
      estateId: currentEstateId,
      flatId: flat.id,
      flatCode: flat.fullFlatCode,
      laneId: flat.laneId,
      requesterId: currentRole === 'soldier' ? activeSoldier?.id || 'soldier-1' : activeTenant?.id || 'tenant-1',
      requesterRole: currentRole,
      requesterName: raisedByName,
      raisedByRole: currentRole,
      raisedById: currentRole === 'soldier' ? activeSoldier?.id || 'soldier-1' : activeTenant?.id || 'tenant-1',
      raisedByName,
      raisedByPhone,
      category: ticketCategory,
      title: ticketTitle,
      description: ticketDesc,
      priority: (ticketSeverity === 'emergency' ? 'emergency' : ticketSeverity === 'high' ? 'high' : ticketSeverity === 'medium' ? 'medium' : 'low') as any,
      severity: ticketSeverity,
      routingTarget: routing,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.createMaintenanceRequest(newReq);
    setShowCreateModal(false);
    setTicketTitle('');
    setTicketDesc('');
    setNoticeMessage(`Ticket #${tNum} created and routed to ${routing === 'phdl_estate_manager' ? 'PHDL Estate Management' : 'Soldier Landlord'}.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleUpdateTicketStatus = (ticket: MaintenanceRequest, newStatus: MaintenanceStatus) => {
    const updated: MaintenanceRequest = {
      ...ticket,
      status: newStatus,
      assignedTechnicianName: technicianName || ticket.assignedTechnicianName,
      assignedTechnicianPhone: technicianPhone || ticket.assignedTechnicianPhone,
      costEstimate: costEstimate || ticket.costEstimate,
      resolutionNotes: resolutionNotes || ticket.resolutionNotes,
      updatedAt: new Date().toISOString(),
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined,
    };

    store.updateMaintenanceRequest(updated);
    setSelectedTicket(updated);
    setNoticeMessage(`Ticket #${ticket.ticketNumber} marked as ${getStatusLabel(newStatus)}.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-military">WORKS & LOGISTICS</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {currentEstate?.name}
            </span>
          </div>
          <h2>Maintenance Requests & Dispute Resolution</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Intelligent ticket routing: Internal flat issues route to Landlord; structural and civil works route directly to PHDL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-outline"
            style={{ gap: '0.4rem', borderColor: '#0284C7', color: '#0369A1' }}
          >
            <Wrench size={16} />
            Export Tickets CSV ({filteredTickets.length})
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} />
            Lodge Maintenance Issue
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Tickets</div>
            <div className="stat-value" style={{ color: '#B45309' }}>
              {visibleTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length}
            </div>
            <div className="stat-subtext">Open / In Progress</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-warning-bg)', color: '#B45309' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Resolved Issues</div>
            <div className="stat-value" style={{ color: '#15803D' }}>
              {visibleTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length}
            </div>
            <div className="stat-subtext">Verified completion</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-success-bg)', color: '#15803D' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Critical / High Severity</div>
            <div className="stat-value" style={{ color: '#DC2626' }}>
              {visibleTickets.filter((t) => (t.severity === 'high' || t.severity === 'emergency') && t.status !== 'resolved').length}
            </div>
            <div className="stat-subtext">Priority dispatch queue</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-danger-bg)', color: '#DC2626' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Tickets or Units</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. MNT-2026, L1H1A, pipe, roof..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="form-select">
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing & Water Pipes</option>
              <option value="electrical_power">Electrical & Breakers</option>
              <option value="structural_roofing">Structural & Roofing</option>
              <option value="civil_drainage">Civil & Drainage</option>
              <option value="security">Security & Access</option>
              <option value="noise_dispute">Noise / Neighbor Dispute</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Severity</label>
            <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="form-select">
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Routing</label>
            <select value={selectedRouting} onChange={(e) => setSelectedRouting(e.target.value)} className="form-select">
              <option value="all">All Targets</option>
              <option value="landlord">Soldier Landlord</option>
              <option value="phdl_estate_manager">PHDL Management</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select">
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Wrench size={18} />
            Maintenance & Complaints Registry ({filteredTickets.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Unit / Lane</th>
                <th>Category & Title</th>
                <th>Severity</th>
                <th>Routing Target</th>
                <th>Raised By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary-900)' }}>
                      {ticket.ticketNumber}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                      {formatDate(ticket.createdAt)}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                      {ticket.flatCode}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ticket.title}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>
                      {ticket.category.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(ticket.severity || 'low')}`}>
                      {(ticket.severity || 'low').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-military" style={{ fontSize: '0.7rem' }}>
                      {ticket.routingTarget === 'phdl_estate_manager' ? 'PHDL Command' : 'Soldier Landlord'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{ticket.raisedByName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                      {(ticket.raisedByRole || 'resident').toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setTechnicianName(ticket.assignedTechnicianName || '');
                        setTechnicianPhone(ticket.assignedTechnicianPhone || '');
                        setCostEstimate(ticket.costEstimate || 10000);
                        setResolutionNotes(ticket.resolutionNotes || '');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      <Eye size={13} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Action Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    Manage Ticket #{selectedTicket.ticketNumber}
                  </h3>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                    Unit {selectedTicket.flatCode} • Routed to {selectedTicket.routingTarget === 'phdl_estate_manager' ? 'PHDL Estate Management' : 'Soldier Landlord'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--primary-900)' }}>{selectedTicket.title}</strong>
                  <span className={`badge ${getStatusBadgeClass(selectedTicket.status)}`}>
                    {getStatusLabel(selectedTicket.status)}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {selectedTicket.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  <span>Raised by: <strong>{selectedTicket.raisedByName}</strong> ({selectedTicket.raisedByPhone})</span>
                  <span>Logged: <strong>{formatDateTime(selectedTicket.createdAt)}</strong></span>
                </div>
              </div>

              {/* Technician Dispatch Form */}
              <div style={{ border: '1px solid var(--border-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Technician Assignment & Work Estimate
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Technician / Corps Name</label>
                    <input
                      type="text"
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                      placeholder="e.g. Engr. Bitrus (Estate Plumber)"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Technician Contact Phone</label>
                    <input
                      type="text"
                      value={technicianPhone}
                      onChange={(e) => setTechnicianPhone(e.target.value)}
                      placeholder="+234 803 000 1122"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  <label className="form-label">Resolution Notes / Parts Replaced</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter technician diagnosis, replaced components, or inspection signoff..."
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleUpdateTicketStatus(selectedTicket, 'in_progress')}
                  className="btn btn-outline btn-sm"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateTicketStatus(selectedTicket, 'resolved')}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <CheckCircle size={14} />
                  Mark Resolved
                </button>
              </div>

              <button type="button" onClick={() => setSelectedTicket(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lodge Ticket Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Lodge Maintenance or Complaint Ticket</h3>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                    System auto-routes to Landlord or PHDL Civil Engineers
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as MaintenanceCategory)}
                      className="form-select"
                    >
                      <option value="plumbing">Plumbing & Water Pipes</option>
                      <option value="electrical_power">Electrical & AC Lines</option>
                      <option value="structural_roofing">Roofing & Structural Walls</option>
                      <option value="civil_drainage">Civil Works & Drainage</option>
                      <option value="security">Security & Access Locks</option>
                      <option value="noise_dispute">Noise or Dispute Escalation</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Severity</label>
                    <select
                      value={ticketSeverity}
                      onChange={(e) => setTicketSeverity(e.target.value as MaintenanceSeverity)}
                      className="form-select"
                    >
                      <option value="low">Low - Routine</option>
                      <option value="medium">Medium - Standard Repair</option>
                      <option value="high">High - Urgent Action Required</option>
                      <option value="emergency">Critical Emergency (Immediate PHDL Dispatch)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Issue Summary / Title</label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="e.g. Master bathroom water pipe burst under floor tile"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Provide full description of the defect, location in unit, and safety impact..."
                    rows={4}
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Target Flat</label>
                  <select
                    value={ticketFlatId}
                    onChange={(e) => setTicketFlatId(e.target.value)}
                    className="form-select"
                  >
                    {flats.slice(0, 30).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.fullFlatCode} ({f.floor})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Wrench size={16} />
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
