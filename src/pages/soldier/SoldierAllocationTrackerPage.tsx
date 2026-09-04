import React from 'react';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { FileText, Printer, Shield, CheckCircle2, Building, Sparkles } from 'lucide-react';

export const SoldierAllocationTrackerPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>HOUSING ALLOCATION DEED</span> • <span>DEED REF: ALC-2026-001</span></div>
          <h1>Provisional Letter of Statutory Allocation</h1>
          <p>Official Armed Forces Housing Scheme Deed confirming statutory property ownership.</p>
        </div>

        <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}>
          <Printer size={14} /> Print Official Deed (PDF)
        </button>
      </div>

      {/* 2. RENDERED OFFICIAL DEED DOCUMENT */}
      <div
        className="card"
        style={{
          padding: '2.5rem',
          backgroundColor: '#FFFFFF',
          border: '2px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: 820,
          margin: '0 auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        {/* Deed Header with Logo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #071A0B', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <PhdlLogo size={56} />
            <div>
              <h2 style={{ margin: 0, color: '#071A0B', fontSize: '1.3rem' }}>POST-HOUSING DEVELOPMENT LIMITED</h2>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 800 }}>ARMED FORCES HOUSING SCHEME • RC 676563</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748B' }}>
            <div>Ref: <strong>ALC-2026-001/HQ</strong></div>
            <div>Date: <strong>10th April, 2022</strong></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <h2 style={{ color: '#1B4D21', fontSize: '1.3rem', letterSpacing: '0.04em', margin: 0 }}>
            PROVISIONAL LETTER OF STATUTORY ALLOCATION
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>
            PHDL UNITY ESTATE (KURUDU, ABUJA FCT)
          </div>
        </div>

        <div style={{ fontSize: '0.92rem', lineHeight: 1.8, color: '#1E293B' }}>
          This is to officially certify that <strong>Staff Sergeant Adamu Mohammed</strong> (Military Service No: <code>NN/8924/ARMY</code>, Nigerian Army) having fulfilled all statutory expression of interest terms and paid the full equity valuation of <strong>₦22,000,000.00 (Twenty-Two Million Naira Only)</strong> is hereby formally allocated:
        </div>

        {/* Property Particulars Box */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estate Name & Location:</span>
            <strong>PHDL Unity Estate (Kurudu, Abuja FCT)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Allocated Housing Unit:</span>
            <strong>Flat L1H1A (Lane 1, House 1, Position A)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Apartment Type:</span>
            <strong>3-Bedroom Luxury Apartment</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Equity Status:</span>
            <strong style={{ color: '#15803D' }}>100% Fully Paid (Verified in Central Bank Treasury)</strong>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', marginTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 900, color: '#0F172A' }}>Col. Farouk Danjuma (Rtd.)</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Managing Director / Commandant (PHDL HQ)</div>
          </div>
          <div style={{ textAlign: 'right', color: '#15803D', fontWeight: 800, fontSize: '0.78rem' }}>
            [ SEALED & REGISTERED WITH RC 676563 ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldierAllocationTrackerPage;