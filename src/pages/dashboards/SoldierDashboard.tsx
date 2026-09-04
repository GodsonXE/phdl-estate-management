import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  LayoutDashboard,
  Building,
  Building2,
  Users,
  CreditCard,
  QrCode,
  Shield,
  Sparkles,
  FileText,
  CheckCircle2,
  Printer,
  ArrowRight,
} from 'lucide-react';

interface SoldierDashboardProps {
  onNavigate?: (page: ActivePage) => void;
}

export const SoldierDashboard: React.FC<SoldierDashboardProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>ARMED FORCES HOUSING PORTAL</span> • <span>STAFF SGT. ADAMU MOHAMMED</span>
          </div>
          <h1>Soldier Landlord Command Overview</h1>
          <p>
            Service Number: <strong>NN/8924/ARMY</strong> • Housing Unit: <strong>Flat L1H1A (Lane 1, House 1)</strong> • 100% Fully Allocated Homeowner.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Export Landlord Summary (PDF)
        </button>
      </div>

      {/* 2. Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Allocated Flat */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('soldier_properties')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #15803D' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>ALLOCATED FLAT</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={18} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            Flat L1H1A
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 800, marginTop: 4 }}>
            ✓ 100% Equity Paid (Deed Sealed)
          </div>
        </div>

        {/* Sublet Tenant */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('soldier_tenants')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #2563EB' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>SUBLET RESIDENT</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#2563EB" />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            Engr. Emeka Okon
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700, marginTop: 4 }}>
            Active Lease (Flat L1H2A)
          </div>
        </div>

        {/* Rental Yield */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('soldier_billing')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #D97706' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>ANNUAL RENT YIELD</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            ₦1,800,000
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            ₦150,000 / month
          </div>
        </div>

        {/* Armed Forces Pass */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('soldier_id_card')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #991B1B' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>MILITARY GATE PASS</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} color="#991B1B" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            Cleared
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700, marginTop: 4 }}>
            24/7 RFID Gate Access
          </div>
        </div>
      </div>

      {/* 3. Quick Action Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Statutory Allocation Deed</h3>
            <span className="badge badge-success">✓ 100% Sealed</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
            Official Statutory Allocation Letter and Deed issued under the authority of the Managing Director / Commandant, PHDL HQ.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('soldier_allocations')}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
          >
            <FileText size={14} /> View Allocation Letter & Deed <ArrowRight size={12} />
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Sublet Lease Management</h3>
            <span className="badge badge-military">1 Active Lease</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
            Manage tenancy particulars, review monthly rent deposits, and ensure service charge compliance.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('soldier_tenants')}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.4rem', fontWeight: 700 }}
          >
            <Users size={14} /> Manage Sublet Tenants <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoldierDashboard;