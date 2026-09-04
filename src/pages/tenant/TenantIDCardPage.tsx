import React from 'react';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { QrCode, Printer, Download, Shield, CheckCircle2 } from 'lucide-react';

export const TenantIDCardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>DIGITAL ACCESS PASS</span> • <span>24/7 GATE CLEARANCE</span></div>
          <h1>Resident Smart ID Gate Pass</h1>
          <p>Present this encrypted QR pass at vehicle gates and pedestrian barrier scanners.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Pass Badge (PDF)
        </button>
      </div>

      {/* RENDERED PVC SMART PASS BADGE */}
      <div
        style={{
          width: 330,
          height: 480,
          borderRadius: 14,
          backgroundColor: '#0A240F',
          color: '#FFFFFF',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.65rem' }}>
          <PhdlLogo size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.04em' }}>POST-HOUSING DEVELOPMENT LIMITED</div>
            <div style={{ fontSize: '0.58rem', color: '#FBBF24', fontWeight: 700 }}>ARMED FORCES HOUSING SCHEME • RC 676563</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.5rem 0' }}>
          <div style={{ width: 68, height: 78, borderRadius: 8, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#071A0B', fontWeight: 900, fontSize: '1.6rem' }}>
            E
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>Engr. Emeka Okon</div>
            <div style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800 }}>RESIDENT TENANT</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>NIN-92841029384</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.58rem', opacity: 0.75 }}>ASSIGNED HOUSING UNIT</div>
            <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>Flat L1H2A • Lane 1</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.58rem', opacity: 0.75 }}>VEHICLE</div>
            <div style={{ fontWeight: 800, fontSize: '0.75rem' }}>RBC-104-XX</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.65rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: 4, borderRadius: 4, display: 'flex' }}>
            <QrCode size={52} color="#000000" />
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.62rem' }}>
            <div>UID: <span style={{ fontFamily: 'var(--font-mono)' }}>E2-80-44-8F-12</span></div>
            <div>EXP: <strong>2025-12-31</strong></div>
            <div style={{ color: '#FBBF24', fontWeight: 800 }}>24/7 VERIFIED PASS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantIDCardPage;