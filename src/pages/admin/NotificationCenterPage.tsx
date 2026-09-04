import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  Megaphone,
  Send,
  CheckCircle2,
  Smartphone,
  Mail,
  Bell,
  Users,
  Shield,
  Sparkles,
  Printer,
} from 'lucide-react';

interface BroadcastRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  target: string;
  channels: ('sms' | 'email' | 'in_app')[];
  recipientsCount: number;
  content: string;
  sender: string;
  status: 'Delivered' | 'Scheduled';
}

const INITIAL_BROADCASTS: BroadcastRecord[] = [
  {
    id: 'BC-2026-001',
    title: 'Mandatory 22:00hrs Perimeter Security Curfew Notice',
    date: '2026-08-31',
    time: '14:30',
    target: 'All 400 Flats (372 Active Residents)',
    channels: ['sms', 'email', 'in_app'],
    recipientsCount: 372,
    content: 'All resident vehicle barriers and external visitor entry gates close promptly at 22:00hrs daily. Late clearance requires SuperAdmin HQ duty officer authorization.',
    sender: 'Col. Farouk Danjuma (Rtd.)',
    status: 'Delivered',
  },
  {
    id: 'BC-2026-002',
    title: 'September 2026 Statutory ₦10,000 Service Charge Invoice Due',
    date: '2026-09-01',
    time: '09:00',
    target: 'All 400 Flats',
    channels: ['sms', 'email'],
    recipientsCount: 372,
    content: 'Monthly residential service charge of ₦10,000 for central security, water supply, and streetlighting is due. Pay online via the Resident Portal.',
    sender: 'HQ Billing Directorate',
    status: 'Delivered',
  },
  {
    id: 'BC-2026-003',
    title: 'Scheduled Transformer Maintenance (Lane 3 & Lane 4)',
    date: '2026-08-28',
    time: '16:00',
    target: 'Lane 3 & Lane 4 Residents (144 Flats)',
    channels: ['sms', 'in_app'],
    recipientsCount: 134,
    content: 'AEDC substation engineers will service the Lane 3-4 step-down transformer between 10:00 - 13:00hrs on Saturday. Backup estate generator will supply water pumps.',
    sender: 'Facility Operations',
    status: 'Delivered',
  },
];

export const NotificationCenterPage: React.FC = () => {
  const store = usePhdlStore();
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>(INITIAL_BROADCASTS);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [channelSms, setChannelSms] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);
  const [senderName, setSenderName] = useState('SuperAdmin HQ Command');
  
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Template Quick Loader
  const loadTemplate = (tmplTitle: string, tmplContent: string, tmplTarget = 'all') => {
    setTitle(tmplTitle);
    setContent(tmplContent);
    setTargetAudience(tmplTarget);
    setChannelSms(true);
    setChannelEmail(true);
    setChannelInApp(true);
  };

  const getRecipientCount = (target: string): number => {
    if (target === 'all') return 372;
    if (target === 'soldiers') return 288;
    if (target === 'tenants') return 84;
    if (target.startsWith('lane_')) {
      const laneNum = Number(target.replace('lane_', ''));
      const lanes = store.getLanes ? store.getLanes() : [];
      const lane = lanes.find((l) => l.laneNumber === laneNum);
      return lane ? lane.occupiedCount : 34;
    }
    return 372;
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedChannels: ('sms' | 'email' | 'in_app')[] = [];
    if (channelSms) selectedChannels.push('sms');
    if (channelEmail) selectedChannels.push('email');
    if (channelInApp) selectedChannels.push('in_app');

    if (selectedChannels.length === 0) {
      alert('Please select at least one delivery channel (SMS, Email, or In-App Notification).');
      return;
    }

    const recipientCount = getRecipientCount(targetAudience);
    let targetLabel = 'All 400 Flats (372 Active Residents)';
    if (targetAudience === 'soldiers') targetLabel = 'Soldier Landlords (288 Personnel)';
    else if (targetAudience === 'tenants') targetLabel = 'Civilian Tenants (84 Residents)';
    else if (targetAudience.startsWith('lane_')) {
      targetLabel = `Lane ${targetAudience.replace('lane_', '')} Residents (${recipientCount} Flats)`;
    }

    const newRecord: BroadcastRecord = {
      id: `BC-2026-${Date.now().toString().slice(-3)}`,
      title,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target: targetLabel,
      channels: selectedChannels,
      recipientsCount: recipientCount,
      content,
      sender: senderName,
      status: 'Delivered',
    };

    setBroadcasts([newRecord, ...broadcasts]);
    setTitle('');
    setContent('');
    setSuccessNotice(
      `🚀 Alert dispatched to ${recipientCount} residents via [${selectedChannels.map((c) => c.toUpperCase()).join(' + ')}] successfully!`
    );
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>COMMAND BROADCAST CENTER</span> • <span>MULTI-CHANNEL ALERTS</span>
          </div>
          <h1>Broadcast Announcements & Emergency Alerts</h1>
          <p>
            Dispatch high-priority communications across <strong>SMS, Email, and Resident In-App Push Notifications</strong> to all 400 flats or segmented military zones.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Broadcast Log
        </button>
      </div>

      {successNotice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          {successNotice}
        </div>
      )}

      {/* 2. Quick Alert Templates */}
      <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--army-green-950)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="var(--army-green-800)" />
          Quick 1-Click Command Broadcast Templates:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => loadTemplate('Mandatory 22:00hrs Security Curfew Protocol', 'All perimeter visitor access terminates at 22:00hrs. All residents must present digital QR passes at gate barriers.')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', borderColor: '#991B1B', color: '#991B1B' }}
          >
            🚨 22:00 Security Curfew
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('Monthly ₦10,000 Service Charge Due Date Reminder', 'Kindly note that the statutory monthly estate levy of ₦10,000 for September is due. Pay seamlessly via your portal.')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', borderColor: '#15803D', color: '#15803D' }}
          >
            💳 ₦10,000 Levy Due Notice
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('Estate Power Substation & Grid Maintenance', 'AEDC technical crew will conduct routine transformer maintenance between 10:00 - 14:00hrs. Power will be restored promptly.')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            ⚡ Transformer Maintenance
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('Central Borehole Water Pumping Schedule', 'Morning water pumping cycle commences at 05:30 - 08:30hrs; Evening cycle commences at 17:00 - 20:00hrs.')}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            🚰 Water Pumping Schedule
          </button>
        </div>
      </div>

      {/* 3. Compose Multi-Channel Dispatch Form */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--army-green-950)' }}>
          Compose Multi-Channel Broadcast
        </h3>

        <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Target Audience & Sender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                <Users size={14} style={{ display: 'inline', marginRight: 4 }} /> Target Recipient Audience:
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="form-select"
              >
                <option value="all">All 400 Estate Flats (372 Active Residents)</option>
                <option value="soldiers">🪖 Soldier Landlords Only (288 Personnel)</option>
                <option value="tenants">🏠 Civilian Tenants Only (84 Residents)</option>
                <option value="lane_1">Lane 1 (34 Occupied Flats)</option>
                <option value="lane_2">Lane 2 (63 Occupied Flats)</option>
                <option value="lane_3">Lane 3 (68 Occupied Flats)</option>
                <option value="lane_4">Lane 4 (66 Occupied Flats)</option>
                <option value="lane_5">Lane 5 (60 Occupied Flats)</option>
                <option value="lane_6">Lane 6 (30 Occupied Flats)</option>
                <option value="lane_7">Lane 7 (26 Occupied Flats)</option>
                <option value="lane_8">Lane 8 (26 Occupied Flats)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                <Shield size={14} style={{ display: 'inline', marginRight: 4 }} /> Dispatching Authority / Sender:
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Multi-Channel Checkboxes */}
          <div style={{ padding: '1rem', backgroundColor: '#F1F5F9', borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--army-green-950)', marginBottom: '0.5rem' }}>
              Select Alert Channels (Multi-Select Enabled):
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>
                <input
                  type="checkbox"
                  checked={channelSms}
                  onChange={(e) => setChannelSms(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#15803D' }}
                />
                <Smartphone size={16} color="#15803D" />
                <span>SMS Alert (Termii DND Gateway)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>
                <input
                  type="checkbox"
                  checked={channelEmail}
                  onChange={(e) => setChannelEmail(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#2563EB' }}
                />
                <Mail size={16} color="#2563EB" />
                <span>Official HTML Email Notice</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>
                <input
                  type="checkbox"
                  checked={channelInApp}
                  onChange={(e) => setChannelInApp(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#D97706' }}
                />
                <Bell size={16} color="#D97706" />
                <span>In-App Resident Portal Banner</span>
              </label>
            </div>
          </div>

          {/* Title & Message */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Broadcast Subject / Headline:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled Power Substation Maintenance & Generator Backup"
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Message Body:</label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {content.length} characters ({Math.ceil(content.length / 160) || 1} SMS unit per recipient)
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Type the official message to be dispatched to residents..."
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', gap: '0.4rem', backgroundColor: '#991B1B', color: '#FFFFFF', fontWeight: 800, padding: '0.65rem 1.25rem' }}
          >
            <Send size={15} /> Dispatch Broadcast ({getRecipientCount(targetAudience)} Residents)
          </button>
        </form>
      </div>

      {/* 4. Broadcast History & Delivery Ledger */}
      <div className="card">
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--army-green-950)' }}>
            Broadcast Dispatch History & Delivery Log ({broadcasts.length})
          </span>
          <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>
            ✓ Real-time Gateway Delivery Confirmation
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Broadcast Subject</th>
                <th>Target Audience</th>
                <th>Channels</th>
                <th>Dispatched By</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)' }}>{b.title}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.content}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E293B' }}>{b.target}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.recipientsCount} Residents</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {b.channels.includes('sms') && (
                        <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', gap: '0.2rem' }}>
                          <Smartphone size={10} /> SMS
                        </span>
                      )}
                      {b.channels.includes('email') && (
                        <span className="badge" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontSize: '0.68rem', padding: '0.15rem 0.4rem', gap: '0.2rem' }}>
                          <Mail size={10} /> EMAIL
                        </span>
                      )}
                      {b.channels.includes('in_app') && (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.68rem', padding: '0.15rem 0.4rem', gap: '0.2rem' }}>
                          <Bell size={10} /> IN-APP
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.sender}</td>
                  <td style={{ fontSize: '0.78rem' }}>
                    <div>{b.date}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.time}</div>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;