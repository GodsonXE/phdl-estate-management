import React, { useState, useEffect, useRef } from 'react';
import { usePhdlStore } from '../../data/storage';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import {
  QrCode,
  Shield,
  User,
  Users,
  Building,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Printer,
  Edit3,
  Palette,
  Eye,
  Lock,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Save,
  Radio,
  FileCheck,
} from 'lucide-react';

export interface GatePass {
  id: string;
  holderName: string;
  role: 'Soldier Owner' | 'Civilian Tenant' | 'Household Dependent' | 'Official Contractor';
  rankOrTitle?: string;
  serviceNoOrNIN: string;
  phone: string;
  flatCode: string;
  laneNumber: number;
  houseNumber: number;
  vehiclePlate?: string;
  qrCode: string;
  rfidUid: string;
  status: 'active' | 'suspended' | 'withdrawn';
  withdrawalReason?: string;
  issueDate: string;
  expiryDate: string;
  lastGateScan: string;
  lastScanBarrier: string;
}

const DEFAULT_PASSES: GatePass[] = [
  {
    id: 'IDC-2026-001',
    holderName: 'Adamu Mohammed',
    rankOrTitle: 'Staff Sergeant',
    role: 'Soldier Owner',
    serviceNoOrNIN: 'NN/8924/ARMY',
    phone: '+234 803 111 2233',
    flatCode: 'L1H1A',
    laneNumber: 1,
    houseNumber: 1,
    vehiclePlate: 'ABJ-492-AR',
    qrCode: 'PHDL-QR-NN8924-L1H1A-2027',
    rfidUid: 'E2-80-11-6C-20-44',
    status: 'active',
    issueDate: '2024-01-10',
    expiryDate: '2027-12-31',
    lastGateScan: '2026-09-03 18:45',
    lastScanBarrier: 'Main Gate Barrier #1 (Inbound)',
  },
  {
    id: 'IDC-2026-002',
    holderName: 'Engr. Emeka Gabriel Okon',
    rankOrTitle: 'Civilian Tenant',
    role: 'Civilian Tenant',
    serviceNoOrNIN: 'NIN-92841029384',
    phone: '+234 803 456 7890',
    flatCode: 'L1H2A',
    laneNumber: 1,
    houseNumber: 2,
    vehiclePlate: 'RBC-104-XX',
    qrCode: 'PHDL-QR-TEN001-L1H2A-2026',
    rfidUid: 'E2-80-44-8F-12-90',
    status: 'active',
    issueDate: '2025-01-01',
    expiryDate: '2025-12-31',
    lastGateScan: '2026-09-03 19:10',
    lastScanBarrier: 'Lane 1 Barrier Gate (Inbound)',
  },
  {
    id: 'IDC-2026-003',
    holderName: 'Tunde Adeyemi',
    rankOrTitle: 'Captain',
    role: 'Soldier Owner',
    serviceNoOrNIN: 'NA/10492/ARMY',
    phone: '+234 809 123 4567',
    flatCode: 'L2H4B',
    laneNumber: 2,
    houseNumber: 4,
    vehiclePlate: 'KJA-552-NA',
    qrCode: 'PHDL-QR-NA10492-L2H4B-2027',
    rfidUid: 'E2-80-99-AA-55-11',
    status: 'active',
    issueDate: '2023-05-15',
    expiryDate: '2027-12-31',
    lastGateScan: '2026-09-02 07:30',
    lastScanBarrier: 'Main Gate Barrier #2 (Outbound)',
  },
  {
    id: 'IDC-2026-004',
    holderName: 'Dr. Fatima Abubakar',
    rankOrTitle: 'Civilian Tenant',
    role: 'Civilian Tenant',
    serviceNoOrNIN: 'NIN-11029481923',
    phone: '+234 802 112 3344',
    flatCode: 'L2H3C',
    laneNumber: 2,
    houseNumber: 3,
    vehiclePlate: 'BWR-771-AB',
    qrCode: 'PHDL-QR-TEN002-L2H3C-2025',
    rfidUid: 'E2-80-33-DD-88-22',
    status: 'suspended',
    withdrawalReason: 'Pending Annual Tenancy Lease Renewal Verification',
    issueDate: '2024-11-01',
    expiryDate: '2025-10-31',
    lastGateScan: '2026-08-30 21:55',
    lastScanBarrier: 'Main Gate Barrier #1 (Inbound)',
  },
];

export const IDCardManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const [passes, setPasses] = useState<GatePass[]>(() => {
    const saved = localStorage.getItem('phdl_gate_passes_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_PASSES;
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals & Active Viewers
  const [reviewingPass, setReviewingPass] = useState<GatePass | null>(null);
  const [generatingPass, setGeneratingPass] = useState<GatePass | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState<GatePass | null>(null);
  const [withdrawReason, setWithdrawReason] = useState('Tenancy Expired / Security Revocation');
  const [isCustomizingDesign, setIsCustomizingDesign] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // SuperAdmin Card Design Template Customizer State
  const [primaryColor, setPrimaryColor] = useState('#0A240F');
  const [accentColor, setAccentColor] = useState('#D97706');
  const [headerTitle, setHeaderTitle] = useState('POST-HOUSING DEVELOPMENT LIMITED');
  const [subHeader, setSubHeader] = useState('ARMED FORCES HOUSING SCHEME • RC 676563');
  const [watermarkText, setWatermarkText] = useState('PHDL VERIFIED 2026');
  const [cardOrientation, setCardOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    localStorage.setItem('phdl_gate_passes_v3', JSON.stringify(passes));
  }, [passes]);

  // 1. Assign Status
  const handleAssignStatus = (passId: string, newStatus: GatePass['status']) => {
    const updated = passes.map((p) => (p.id === passId ? { ...p, status: newStatus } : p));
    setPasses(updated);
    if (reviewingPass && reviewingPass.id === passId) {
      setReviewingPass({ ...reviewingPass, status: newStatus });
    }
    setNotice(`Pass ${passId} status updated to: ${newStatus.toUpperCase()}`);
    setTimeout(() => setNotice(null), 3500);
  };

  // 2. Withdraw Pass
  const handleWithdrawPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWithdrawing) return;

    const updated = passes.map((p) =>
      p.id === isWithdrawing.id
        ? { ...p, status: 'withdrawn' as const, withdrawalReason: withdrawReason }
        : p
    );
    setPasses(updated);
    setIsWithdrawing(null);
    setNotice(`🚨 Gate Pass for ${isWithdrawing.holderName} (${isWithdrawing.flatCode}) has been REVOKED and barred from gate clearance.`);
    setTimeout(() => setNotice(null), 5000);
  };

  // 3. Download Image representation
  const handleDownloadPassImage = (pass: GatePass) => {
    const svgElement = document.getElementById(`pass-card-svg-${pass.id}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PHDL_Smart_GatePass_${pass.holderName.replace(/\s+/g, '_')}_${pass.flatCode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Digital Pass Image generated and downloaded for ${pass.holderName}!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredPasses = passes.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const mName = p.holderName.toLowerCase().includes(q);
      const mFlat = p.flatCode.toLowerCase().includes(q);
      const mSrv = p.serviceNoOrNIN.toLowerCase().includes(q);
      const mPlate = p.vehiclePlate?.toLowerCase().includes(q);
      if (!mName && !mFlat && !mSrv && !mPlate) return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>PERIMETER ACCESS & SECURITY</span> • <span>372 SMART BIOMETRIC PASSES</span>
          </div>
          <h1>Digital Gate Passes & Smart ID Cards</h1>
          <p>
            Manage encrypted RFID credentials, assign clearance statuses, review access audit logs, withdraw compromised passes, and generate printable digital passes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsCustomizingDesign(true)}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.4rem', borderColor: '#15803D', color: '#15803D', fontWeight: 700 }}
          >
            <Palette size={14} /> Customize Pass Template (SuperAdmin)
          </button>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Printer size={14} /> Export Gate Pass Roster (PDF)
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* 2. Filter & Search Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Cardholder Name, Flat Code, Service No, or Vehicle Plate..."
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
              <option value="all">-- All Statuses ({passes.length}) --</option>
              <option value="active">Active (Cleared)</option>
              <option value="suspended">Suspended (Under Review)</option>
              <option value="withdrawn">Withdrawn / Revoked</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="form-select">
              <option value="all">-- All Resident Roles --</option>
              <option value="Soldier Owner">Soldier Landlords</option>
              <option value="Civilian Tenant">Civilian Tenants</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Gate Passes Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pass Ref & Cardholder</th>
                <th>Assigned Flat</th>
                <th>Role & Credentials</th>
                <th>Vehicle & RFID Tag</th>
                <th>Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPasses.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.id}</div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
                      {p.rankOrTitle && p.rankOrTitle !== 'Civilian Tenant' ? `${p.rankOrTitle} ` : ''}{p.holderName}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📞 {p.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-military" style={{ fontWeight: 800 }}>Flat {p.flatCode}</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Lane {p.laneNumber} (House {p.houseNumber})
                    </div>
                  </td>
                  <td>
                    <div><span className="badge badge-success">{p.role}</span></div>
                    <div style={{ fontSize: '0.74rem', color: '#475569', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{p.serviceNoOrNIN}</div>
                  </td>
                  <td>
                    <div><strong>{p.vehiclePlate || 'Pedestrian'}</strong></div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RFID: {p.rfidUid}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === 'active'
                          ? 'badge-success'
                          : p.status === 'suspended'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                      style={{ textTransform: 'uppercase', fontWeight: 800 }}
                    >
                      {p.status === 'active' ? '✓ Cleared' : p.status === 'suspended' ? '⚠️ Suspended' : '⛔ Revoked'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {/* Review User */}
                      <button
                        type="button"
                        onClick={() => setReviewingPass(p)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', gap: '0.25rem' }}
                      >
                        <User size={12} /> Review
                      </button>

                      {/* Generate / View Pass Image */}
                      <button
                        type="button"
                        onClick={() => setGeneratingPass(p)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', gap: '0.25rem', backgroundColor: '#15803D' }}
                      >
                        <QrCode size={12} /> View Pass
                      </button>

                      {/* Withdraw Pass Button */}
                      {p.status !== 'withdrawn' ? (
                        <button
                          type="button"
                          onClick={() => setIsWithdrawing(p)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', gap: '0.25rem', borderColor: '#991B1B', color: '#991B1B' }}
                        >
                          <XCircle size={12} /> Withdraw
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssignStatus(p.id, 'active')}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', gap: '0.25rem', borderColor: '#15803D', color: '#15803D' }}
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: USER & CARDHOLDER SECURITY REVIEW */}
      {/* ========================================================================= */}
      {reviewingPass && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Cardholder Security Review: {reviewingPass.holderName}</h3>
              <button onClick={() => setReviewingPass(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>RESIDENT FULL NAME:</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{reviewingPass.holderName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reviewingPass.role}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ASSIGNED HOUSING UNIT:</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--army-green-950)' }}>
                    Flat {reviewingPass.flatCode} (Lane {reviewingPass.laneNumber})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>House {reviewingPass.houseNumber}</div>
                </div>
              </div>

              {/* Status Assignment Controls */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 800 }}>
                  Assign Gate Clearance Status:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAssignStatus(reviewingPass.id, 'active')}
                    className={`btn btn-sm ${reviewingPass.status === 'active' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ backgroundColor: reviewingPass.status === 'active' ? '#15803D' : 'transparent', color: reviewingPass.status === 'active' ? '#FFF' : '#15803D', fontWeight: 800 }}
                  >
                    ✓ Active (Cleared)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignStatus(reviewingPass.id, 'suspended')}
                    className={`btn btn-sm ${reviewingPass.status === 'suspended' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ backgroundColor: reviewingPass.status === 'suspended' ? '#D97706' : 'transparent', color: reviewingPass.status === 'suspended' ? '#FFF' : '#D97706', fontWeight: 800 }}
                  >
                    ⚠️ Suspended
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignStatus(reviewingPass.id, 'withdrawn')}
                    className={`btn btn-sm ${reviewingPass.status === 'withdrawn' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ backgroundColor: reviewingPass.status === 'withdrawn' ? '#991B1B' : 'transparent', color: reviewingPass.status === 'withdrawn' ? '#FFF' : '#991B1B', fontWeight: 800 }}
                  >
                    ⛔ Withdrawn
                  </button>
                </div>
              </div>

              {/* Access Audit Log */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.5rem', color: 'var(--army-green-950)' }}>
                  Recent Perimeter Gate Barrier Logs:
                </div>
                <div style={{ fontSize: '0.78rem', backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Scanned: <strong>{reviewingPass.lastGateScan}</strong></span>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>{reviewingPass.lastScanBarrier}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setReviewingPass(null)} className="btn btn-outline">Close Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: PASS WITHDRAWAL / REVOCATION WITH REASON LOGGING */}
      {/* ========================================================================= */}
      {isWithdrawing && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header" style={{ backgroundColor: '#991B1B' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Revoke & Withdraw Gate Pass</h3>
              <button onClick={() => setIsWithdrawing(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleWithdrawPass} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ color: '#991B1B', fontSize: '0.85rem', fontWeight: 700 }}>
                ⚠️ Warning: Revoking this digital pass will immediately block RFID barriers and invalidate the QR gate pass for {isWithdrawing.holderName} (Flat {isWithdrawing.flatCode}).
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Official Revocation Reason *:</label>
                <select value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} className="form-select">
                  <option value="Tenancy Expired / Vacated">Tenancy Expired / Resident Vacated</option>
                  <option value="Security Violation / Disciplinary Bar">Security Violation / Disciplinary Bar</option>
                  <option value="Service Charge Non-Compliance">Service Charge Non-Compliance</option>
                  <option value="Lost / Damaged Physical RFID Card">Lost / Damaged Physical RFID Card</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsWithdrawing(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#991B1B' }}>
                  Confirm Revocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: LIVE DIGITAL SMART PASS IMAGE GENERATOR & VIEWER */}
      {/* ========================================================================= */}
      {generatingPass && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Official Biometric Gate Pass Generator</h3>
              <button onClick={() => setGeneratingPass(null)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              {/* RENDERED PASS BADGE (SVG) */}
              <div
                style={{
                  width: 320,
                  height: cardOrientation === 'portrait' ? 460 : 260,
                  borderRadius: 14,
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.35)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {/* Status Stamp if Revoked */}
                {generatingPass.status === 'withdrawn' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-30deg)',
                      border: '4px solid #EF4444',
                      color: '#EF4444',
                      padding: '0.4rem 1.5rem',
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      letterSpacing: '0.1em',
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      zIndex: 20,
                      borderRadius: 6,
                    }}
                  >
                    REVOKED
                  </div>
                )}

                {/* Header with Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.65rem' }}>
                  <PhdlLogo size={36} />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.04em' }}>{headerTitle}</div>
                    <div style={{ fontSize: '0.58rem', color: accentColor, fontWeight: 700 }}>{subHeader}</div>
                  </div>
                </div>

                {/* Body: Cardholder Particulars */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.5rem 0' }}>
                  <div style={{ width: 64, height: 74, borderRadius: 8, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#071A0B', fontWeight: 900, fontSize: '1.4rem' }}>
                    {generatingPass.holderName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.92rem' }}>{generatingPass.holderName}</div>
                    <div style={{ fontSize: '0.72rem', color: accentColor, fontWeight: 800 }}>{generatingPass.role.toUpperCase()}</div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.85, fontFamily: 'var(--font-mono)' }}>{generatingPass.serviceNoOrNIN}</div>
                  </div>
                </div>

                {/* Housing Unit Badge */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', padding: '0.5rem 0.75rem', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.58rem', opacity: 0.75 }}>ASSIGNED HOUSING UNIT</div>
                    <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>Flat {generatingPass.flatCode} • Lane {generatingPass.laneNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.58rem', opacity: 0.75 }}>VEHICLE</div>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem' }}>{generatingPass.vehiclePlate || 'Pedestrian'}</div>
                  </div>
                </div>

                {/* QR Code & Barcode Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.65rem' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: 4, borderRadius: 4, display: 'flex' }}>
                    <QrCode size={48} color="#000000" />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.62rem' }}>
                    <div>UID: <span style={{ fontFamily: 'var(--font-mono)' }}>{generatingPass.rfidUid}</span></div>
                    <div>EXP: <strong>{generatingPass.expiryDate}</strong></div>
                    <div style={{ color: accentColor, fontWeight: 800 }}>24/7 ENCRYPTED PASS</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ flex: 1, gap: '0.4rem' }}
                >
                  <Printer size={15} /> Print PVC Card (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPassImage(generatingPass)}
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#15803D', gap: '0.4rem' }}
                >
                  <Download size={15} /> Download Pass Graphic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: SUPERADMIN-ONLY PASS DESIGN CUSTOMIZER */}
      {/* ========================================================================= */}
      {isCustomizingDesign && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={18} color="#FBBF24" />
                <h3 style={{ margin: 0, color: '#FFFFFF' }}>SuperAdmin Pass Template Customizer</h3>
              </div>
              <button onClick={() => setIsCustomizingDesign(false)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#166534', backgroundColor: '#F0FDF4', padding: '0.75rem', borderRadius: 6, border: '1px solid #BBF7D0' }}>
                🔒 <strong>SuperAdmin Clearance Verified:</strong> Changes made here will govern the badge layout across all 400 residential flats.
              </div>

              {/* Color Preset Palette */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Theme Color Preset:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[
                    { name: 'Army Combat Green', bg: '#0A240F', acc: '#D97706' },
                    { name: 'Navy Commander Blue', bg: '#0F172A', acc: '#38BDF8' },
                    { name: 'Desert Command Gold', bg: '#451A03', acc: '#FBBF24' },
                    { name: 'Cyber Security Dark', bg: '#18181B', acc: '#22C55E' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.bg);
                        setAccentColor(preset.acc);
                      }}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 6,
                        border: primaryColor === preset.bg ? '2px solid #15803D' : '1px solid #CBD5E1',
                        backgroundColor: preset.bg,
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Header Title Text:</label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Subheader Scheme Text:</label>
                  <input
                    type="text"
                    value={subHeader}
                    onChange={(e) => setSubHeader(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Card Orientation:</label>
                  <select
                    value={cardOrientation}
                    onChange={(e) => setCardOrientation(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="portrait">Vertical Portrait Badge</option>
                    <option value="landscape">Horizontal Landscape Badge</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Security Watermark:</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCustomizingDesign(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomizingDesign(false);
                    setNotice('🎨 SuperAdmin Pass Design Template saved and deployed to all gate passes!');
                    setTimeout(() => setNotice(null), 4000);
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
                >
                  <Save size={14} /> Deploy Design Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCardManagementPage;