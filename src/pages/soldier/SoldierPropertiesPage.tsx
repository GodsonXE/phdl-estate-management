import React from 'react';
import { Building, Building2, Shield, Printer, CheckCircle2 } from 'lucide-react';

export const SoldierPropertiesPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>REAL ESTATE PORTFOLIO</span> • <span>1 ALLOCATED FLAT</span></div>
          <h1>My Allocated Properties</h1>
          <p>Particulars of your statutory housing allotment in PHDL Unity Estate.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Export Property Certificate (PDF)
        </button>
      </div>

      <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #15803D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: 4 }}>Primary Allocation</span>
            <h2 style={{ margin: '4px 0', color: 'var(--army-green-950)' }}>Flat L1H1A</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Lane 1, House 1 (Ground Floor Left) • PHDL Unity Estate (Kurudu, Abuja)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VALUATION:</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--army-green-950)' }}>₦22,000,000</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>APARTMENT TYPE:</div>
            <strong>3-Bedroom Luxury Flat</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>PREPAID METER NUMBER:</div>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>MTR-PHDL-1001</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>DATE SEALED:</div>
            <strong>April 10, 2022</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>CURRENT TENANCY:</div>
            <strong>Owner Occupied / Sublet Allowed</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldierPropertiesPage;