import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  Building,
  Building2,
  Users,
  Shield,
  CreditCard,
  QrCode,
  ArrowUpRight,
  Receipt,
  UserCheck,
  Megaphone,
  TrendingUp,
  Activity,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate?: (page: ActivePage) => void;
}

const DEFAULT_LANE_DATA = [
  { id: 'lane-1', laneNumber: 1, name: 'Lane 1', blockCount: 9, flatCount: 36, occupiedCount: 34 },
  { id: 'lane-2', laneNumber: 2, name: 'Lane 2', blockCount: 17, flatCount: 68, occupiedCount: 63 },
  { id: 'lane-3', laneNumber: 3, name: 'Lane 3', blockCount: 18, flatCount: 72, occupiedCount: 68 },
  { id: 'lane-4', laneNumber: 4, name: 'Lane 4', blockCount: 18, flatCount: 72, occupiedCount: 66 },
  { id: 'lane-5', laneNumber: 5, name: 'Lane 5', blockCount: 16, flatCount: 64, occupiedCount: 60 },
  { id: 'lane-6', laneNumber: 6, name: 'Lane 6', blockCount: 8, flatCount: 32, occupiedCount: 30 },
  { id: 'lane-7', laneNumber: 7, name: 'Lane 7', blockCount: 7, flatCount: 28, occupiedCount: 26 },
  { id: 'lane-8', laneNumber: 8, name: 'Lane 8', blockCount: 7, flatCount: 28, occupiedCount: 26 },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const rawLanes = store.getLanes ? store.getLanes() : [];
  const lanes = rawLanes.length > 0 ? rawLanes : DEFAULT_LANE_DATA;

  const totalFlats = 400;
  const totalHouses = 100;
  const occupiedFlats = lanes.reduce((sum, l) => sum + (l.occupiedCount || 34), 0);
  const occupancyRate = Math.round((occupiedFlats / totalFlats) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>HQ COMMAND CONTROL</span> • <span>PHDL UNITY ESTATE (KURUDU)</span>
          </div>
          <h1>SuperAdmin Command Dashboard</h1>
          <p>
            Master operational oversight across <strong>400 Housing Units (100 Houses across 8 Lanes)</strong> and ₦10,000/mo service charge revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('admin_hierarchy')}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Building2 size={14} /> 400 Flats Tree
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('admin_settings')}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem', backgroundColor: '#1B4D21' }}
          >
            <Shield size={14} /> System Settings
          </button>
        </div>
      </div>

      {/* 2. FOUR PRIMARY STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('admin_flats')}
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--army-green-800)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Housing Units
            </span>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--army-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} color="var(--army-green-800)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: '0.5rem' }}>
            {totalFlats} Flats
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            {totalHouses} Houses Across 8 Zoned Lanes
          </div>
        </div>

        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('admin_hierarchy')}
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--army-gold-600)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Estate Occupancy
            </span>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--army-gold-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="var(--army-gold-800)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: '0.5rem' }}>
            {occupancyRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--army-green-800)', fontWeight: 700, marginTop: '0.25rem' }}>
            {occupiedFlats} of {totalFlats} Units Active (28 Reserves)
          </div>
        </div>

        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('billing_mgmt')}
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--army-green-600)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Monthly Levy Ledger
            </span>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--army-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={18} color="var(--army-green-700)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: '0.5rem' }}>
            ₦4,000,000
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Standard ₦10,000/Flat Monthly Levy
          </div>
        </div>

        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('admin_id_cards')}
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--army-red-700)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Smart Gate Passes
            </span>
            <div style={{ width: 34, height: 34, borderRadius: '6px', backgroundColor: 'var(--army-red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} color="var(--army-red-700)" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: '0.5rem' }}>
            {occupiedFlats} Issued
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-success-text)', fontWeight: 700, marginTop: '0.25rem' }}>
            24/7 QR Verification Active
          </div>
        </div>
      </div>

      {/* 3. VISUAL CHARTS ROW: PIE CHART & REVENUE TREND */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* CHART 1: SVG DONUT / PIE CHART */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--army-green-950)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} color="var(--army-green-800)" />
              Tenancy Composition (400 Units)
            </div>
            <span className="badge badge-success">93% Occupancy</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4.2" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#15803D" strokeWidth="4.5" strokeDasharray="72 28" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="21 79" strokeDashoffset="-72" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="7 93" strokeDashoffset="-93" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--army-green-950)', lineHeight: 1 }}>400</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLATS</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#15803D' }} />
                <span><strong>288</strong> Soldier Owners (72%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#3B82F6' }} />
                <span><strong>84</strong> Sublet Tenants (21%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#F59E0B' }} />
                <span><strong>28</strong> Command Reserves (7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: REVENUE PERFORMANCE RUN-RATE */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--army-green-950)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--army-green-800)" />
              Monthly Service Charge Collection (2026)
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803D' }}>₦4.0M Target/mo</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, paddingTop: 10 }}>
            {[
              { m: 'Apr', h: 82, a: '₦3.3M' },
              { m: 'May', h: 88, a: '₦3.5M' },
              { m: 'Jun', h: 92, a: '₦3.7M' },
              { m: 'Jul', h: 95, a: '₦3.8M' },
              { m: 'Aug', h: 98, a: '₦3.9M' },
              { m: 'Sep', h: 100, a: '₦4.0M' },
            ].map((bar) => (
              <div key={bar.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>{bar.a}</span>
                <div
                  style={{
                    width: '42%',
                    height: `${bar.h}px`,
                    backgroundColor: bar.m === 'Sep' ? '#1B4D21' : 'var(--army-green-600)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--army-green-950)' }}>{bar.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 8-LANE CAPACITY */}
      <div className="card card-army-accent">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="var(--army-green-800)" />
            Lane Infrastructure Capacity (8 Lanes • 100 Houses • 400 Flats)
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('admin_hierarchy')}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.25rem', fontSize: '0.75rem', color: 'var(--army-green-800)', fontWeight: 700 }}
          >
            View Tree <ArrowUpRight size={13} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1rem' }}>
          {lanes.map((lane) => {
            const flatCount = lane.flatCount;
            const occupied = lane.occupiedCount;
            const pct = Math.round((occupied / flatCount) * 100);

            return (
              <div
                key={lane.id || lane.laneNumber}
                onClick={() => onNavigate && onNavigate('admin_hierarchy')}
                style={{
                  cursor: 'pointer',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--army-green-950)' }}>
                      {lane.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      ({lane.blockCount} Houses • {flatCount} Flats)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--army-green-800)' }}>
                    {occupied}/{flatCount} Units ({pct}%)
                  </span>
                </div>

                <div style={{ width: '100%', height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: pct > 90 ? 'var(--army-green-800)' : 'var(--army-gold-600)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;