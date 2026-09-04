import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  LayoutDashboard,
  CreditCard,
  QrCode,
  Users,
  FileText,
  Shield,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface TenantDashboardProps {
  onNavigate?: (page: ActivePage) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ onNavigate }) => {
  const [hasPaidLevy, setHasPaidLevy] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>RESIDENT TENANT PORTAL</span> • <span>FLAT L1H2A (LANE 1, HOUSE 2)</span>
          </div>
          <h1>Welcome, Engr. Emeka Gabriel Okon</h1>
          <p>
            Official resident overview: Tenancy lease status, monthly ₦10,000 service charge ledger, and 24/7 digital gate barrier pass.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Printer size={14} /> Export Resident Summary (PDF)
          </button>
        </div>
      </div>

      {/* 2. Primary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {/* Service Charge Card */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('tenant_billing')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #15803D' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>SERVICE CHARGE (SEP 2026)</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            ₦10,000.00
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 800, marginTop: 4 }}>
            ✓ Verified & Settled
          </div>
        </div>

        {/* Gate Pass Card */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('tenant_id_card')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #D97706' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>DIGITAL GATE PASS</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={18} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            Active (Cleared)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Pass Ref: IDC-2026-002
          </div>
        </div>

        {/* Household Dependents */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('tenant_dependents')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #2563EB' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>REGISTERED HOUSEHOLD</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="#2563EB" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            4 Members
          </div>
          <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700, marginTop: 4 }}>
            All Cleared for Gate Access
          </div>
        </div>

        {/* Tenancy Agreement */}
        <div
          className="card stat-card"
          onClick={() => onNavigate && onNavigate('tenant_profile')}
          style={{ cursor: 'pointer', borderLeft: '4px solid #9333EA' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>TENANCY LEASE</span>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="#9333EA" />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 8 }}>
            Expires Dec 2025
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Landlord: Staff Sgt. Adamu
          </div>
        </div>
      </div>

      {/* 3. Quick Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--army-green-950)' }}>
            Allocated Apartment Particulars
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Apartment Unit:</span>
              <strong>Flat L1H2A (Ground Floor Left)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lane & House:</span>
              <strong>Lane 1 (House 2)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Apartment Type:</span>
              <strong>3-Bedroom Luxury Flat</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Prepaid Meter Number:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>MTR-PHDL-1042</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Soldier Landlord:</span>
              <strong>Staff Sgt. Adamu Mohammed (NN/8924/ARMY)</strong>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--army-green-950)' }}>
            Perimeter Security & Curfew Policy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="#15803D" />
              <span>24/7 RFID Gate Barrier operational across all 8 Lanes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="#B45309" />
              <span>Mandatory <strong>22:00hrs Night Visitor Curfew</strong> active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#15803D" />
              <span>Emergency Security Control Room: <strong>+234 803 999 0001</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;