import React from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  Building2,
  Home,
  Users,
  ShieldCheck,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Megaphone,
  ArrowUpRight,
  Sparkles,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { formatNaira, formatDate, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';
import { ActivePage } from '../../components/layout/Sidebar';

interface AdminDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const estates = store.getEstates();
  const lanes = store.getLanes(currentEstateId);
  const flats = store.getFlats(currentEstateId);
  const soldiers = store.getSoldiers();
  const tenants = store.getTenants(currentEstateId);
  const bills = store.getBills(currentEstateId);
  const maintenance = store.getMaintenanceRequests(currentEstateId);
  const idCards = store.getIDCards(currentEstateId);

  // Calculations
  const totalFlats = flats.length;
  const ownerOccupied = flats.filter((f) => f.status === 'owner_occupied').length;
  const sublet = flats.filter((f) => f.status === 'sublet').length;
  const unoccupied = flats.filter((f) => f.status === 'unoccupied' || (f.status as any) === 'vacant').length;
  const underMnt = flats.filter((f) => (f.status as any) === 'under_maintenance').length;
  const occupancyPercent = totalFlats > 0 ? Math.round(((ownerOccupied + sublet) / totalFlats) * 100) : 0;

  const totalBilled = bills.reduce((acc, b) => acc + (b.totalAmount || b.amount || 0), 0);
  const totalCollected = bills.reduce((acc, b) => acc + (b.paidAmount || (b.ownerPaidAmount || 0) + (b.tenantPaidAmount || 0)), 0);
  const totalArrears = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const pendingKYC = soldiers.filter((s) => s.verificationStatus === 'pending' || (s.verificationStatus as any) === 'pending_verification').length;
  const openTickets = maintenance.filter((m) => m.status !== 'resolved' && m.status !== 'closed' && m.status !== 'completed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Official Executive Command Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--army-green-950) 0%, var(--army-green-900) 60%, var(--army-green-800) 100%)',
          color: '#FFFFFF',
          padding: '1.75rem',
          border: '2px solid var(--army-gold-500)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Watermark Logo */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            opacity: 0.1,
            pointerEvents: 'none',
            width: 220,
            height: 220,
          }}
        >
          <img src="/phdl-logo.png" alt="watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 3px var(--army-gold-400), 0 8px 16px rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}
            >
              <img src="/phdl-logo.png" alt="PHDL Official Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span className="badge" style={{ backgroundColor: 'var(--army-red-600)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                  HEADQUARTERS COMMAND
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--army-gold-300)', fontWeight: 700 }}>
                  POST-SERVICE HOUSING DEVELOPMENT LIMITED • RC 676563
                </span>
              </div>
              <h1 style={{ color: '#FFFFFF', fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                {currentEstate?.name} Operations Center
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {currentEstate?.address} • Manager: <strong>{currentEstate?.managerName}</strong> ({currentEstate?.managerPhone})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('admin_hierarchy')} className="btn btn-accent" style={{ gap: '0.4rem', backgroundColor: 'var(--army-gold-500)', color: '#072B1C', fontWeight: 800 }}>
              <Building2 size={16} />
              Explore 404 Flats
            </button>
            <button onClick={() => onNavigate('gate_scanner')} className="btn btn-outline" style={{ gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.35)' }}>
              <QrCode size={16} />
              Gate Pass Scanner
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stat Grid */}
      <div className="stat-grid">
        <div className="stat-card" onClick={() => onNavigate('admin_hierarchy')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Estate Housing Occupancy</div>
            <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>{occupancyPercent}%</div>
            <div className="stat-subtext">
              {ownerOccupied + sublet} of {totalFlats} Housing Units Active
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Home size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('billing_mgmt')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Revenue Collected</div>
            <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>{formatNaira(totalCollected)}</div>
            <div className="stat-subtext">Collection compliance: {collectionRate}%</div>
          </div>
          <div className="stat-icon-wrapper">
            <Receipt size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('billing_mgmt')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Pending Levy Arrears</div>
            <div className="stat-value" style={{ color: 'var(--army-red-700)' }}>{formatNaira(totalArrears)}</div>
            <div className="stat-subtext">{bills.filter((b) => b.status === 'overdue').length} Overdue Invoices</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-wrapper-red">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('admin_verification')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Soldier KYC Queue</div>
            <div className="stat-value" style={{ color: pendingKYC > 0 ? 'var(--army-gold-700)' : 'var(--army-green-800)' }}>
              {pendingKYC} Pending
            </div>
            <div className="stat-subtext">{soldiers.length} Total Verified Soldiers</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-wrapper-gold">
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* Lane Breakdown & Subletting Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Lane Occupancy Meter */}
        <div className="card card-army-accent">
          <div className="card-header">
            <div className="card-title">
              <Building2 size={18} color="var(--army-green-800)" />
              Lane-by-Lane Infrastructure (8 Lanes • 101 Blocks)
            </div>
            <button onClick={() => onNavigate('admin_hierarchy')} className="btn btn-ghost btn-sm" style={{ gap: '0.25rem', fontSize: '0.75rem', color: 'var(--army-green-800)', fontWeight: 700 }}>
              View All <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {lanes.map((lane) => {
              const laneFlats = flats.filter((f) => f.laneId === lane.id);
              const laneOccupied = laneFlats.filter((f) => f.status === 'owner_occupied' || f.status === 'sublet').length;
              const lanePercent = laneFlats.length > 0 ? Math.round((laneOccupied / laneFlats.length) * 100) : 0;

              return (
                <div
                  key={lane.id}
                  onClick={() => onNavigate('admin_hierarchy')}
                  style={{ cursor: 'pointer', padding: '0.25rem 0.35rem', borderRadius: 4, transition: 'background 0.15s' }}
                  title={`Click to view ${lane.name} units in Estate Hierarchy`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--army-green-950)' }}>{lane.name}</span>
                    <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>
                      {laneOccupied} / {laneFlats.length} Flats ({lanePercent}%)
                    </span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'var(--army-green-50)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${lanePercent}%`,
                        backgroundColor: lanePercent > 80 ? 'var(--army-green-700)' : 'var(--army-gold-500)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subletting & Tenancy Compliance */}
        <div className="card card-red-accent">
          <div className="card-header">
            <div className="card-title">
              <Users size={18} color="var(--army-red-700)" />
              Subletting & Residency Distribution
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => onNavigate('admin_soldiers')}
                style={{ padding: '1rem', backgroundColor: 'var(--army-green-50)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--army-green-200)', cursor: 'pointer', transition: 'transform 0.15s' }}
                title="Click to view Soldier Landlords"
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--army-green-800)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Soldier Owner-Occupied
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                  {ownerOccupied}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {Math.round((ownerOccupied / totalFlats) * 100)}% of total estate
                </div>
              </div>

              <div
                onClick={() => onNavigate('admin_tenants')}
                style={{ padding: '1rem', backgroundColor: 'var(--army-red-50)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--army-red-200)', cursor: 'pointer', transition: 'transform 0.15s' }}
                title="Click to view Civilian Tenant Residents"
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--army-red-800)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Sublet to Civilian Tenants
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--army-red-950)' }}>
                  {sublet}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {Math.round((sublet / totalFlats) * 100)}% of total estate
                </div>
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border-light)' }}>
              <div
                onClick={() => onNavigate('admin_id_cards')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', padding: '0.2rem 0' }}
                title="Click to manage Digital Gate Passes"
              >
                <span style={{ textDecoration: 'underline' }}>Total Smart ID Cards Issued:</span>
                <strong style={{ color: 'var(--army-green-950)' }}>{idCards.length} Cards →</strong>
              </div>
              <div
                onClick={() => onNavigate('maintenance')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', padding: '0.2rem 0' }}
                title="Click to view Maintenance Requests"
              >
                <span style={{ textDecoration: 'underline' }}>Open Maintenance Tickets:</span>
                <strong style={{ color: openTickets > 0 ? 'var(--army-red-700)' : 'var(--army-green-800)' }}>{openTickets} Tickets →</strong>
              </div>
              <div
                onClick={() => onNavigate('admin_flats')}
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', padding: '0.2rem 0' }}
                title="Click to manage Flat status"
              >
                <span style={{ textDecoration: 'underline' }}>Unoccupied / Empty Units:</span>
                <strong style={{ color: 'var(--text-subtle)' }}>{unoccupied} Units →</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onNavigate('notifications_scheduler')} className="btn btn-outline" style={{ flex: 1, gap: '0.35rem', fontSize: '0.775rem' }}>
                <Megaphone size={14} />
                Send Broadcast
              </button>
              <button onClick={() => onNavigate('billing_mgmt')} className="btn btn-primary" style={{ flex: 1, gap: '0.35rem', fontSize: '0.775rem' }}>
                <Receipt size={14} />
                Generate Levies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
