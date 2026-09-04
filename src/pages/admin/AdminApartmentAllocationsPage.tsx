import React, { useState } from 'react';
import { usePhdlStore, NATIONWIDE_18_ESTATES } from '../../data/storage';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  Sparkles,
  Building,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  Download,
  Search,
  Filter,
  FileText,
  User,
  Shield,
  CreditCard,
  ChevronRight,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface AllocationsPageProps {
  onNavigate?: (page: ActivePage) => void;
}

export const AdminApartmentAllocationsPage: React.FC<AllocationsPageProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const [search, setSearch] = useState('');
  const [selectedDeed, setSelectedDeed] = useState<any | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Application Form State
  const [appRank, setAppRank] = useState('Captain');
  const [appName, setAppName] = useState('');
  const [appSrv, setAppSrv] = useState('');
  const [appPhone, setAppPhone] = useState('');
  const [appEstate, setAppEstate] = useState('estate-kurudu-01');

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(false);
    setNotice(`✅ Application for ${appRank} ${appName} (${appSrv}) registered! ₦20,000 EOI Form purchase verified.`);
    setTimeout(() => setNotice(null), 4500);
  };

  const allocations = [
    {
      id: 'ALC-2026-001',
      applicantRank: 'Staff Sergeant',
      applicantName: 'Adamu Mohammed',
      serviceNumber: 'NN/8924/ARMY',
      phone: '+234 803 111 2233',
      targetEstateName: 'PHDL Unity Estate (Kurudu, Abuja FCT)',
      allocatedFlatCode: 'L1H1A',
      laneNumber: 1,
      apartmentType: '3-Bedroom Luxury Apartment',
      totalPropertyCost: 22000000,
      amountPaid: 22000000,
      applicationDate: '2022-01-15',
      approvalStatus: 'fully_paid_allocated',
      approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    },
    {
      id: 'ALC-2026-002',
      applicantRank: 'Captain',
      applicantName: 'Tunde Adeyemi',
      serviceNumber: 'NA/10492/ARMY',
      phone: '+234 809 123 4567',
      targetEstateName: 'PHDL Unity Estate (Kurudu, Abuja FCT)',
      allocatedFlatCode: 'L2H4B',
      laneNumber: 2,
      apartmentType: '3-Bedroom Luxury Apartment',
      totalPropertyCost: 22000000,
      amountPaid: 16500000,
      applicationDate: '2023-04-10',
      approvalStatus: 'installments_active',
      approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    },
    {
      id: 'ALC-2026-003',
      applicantRank: 'Lt. Commander',
      applicantName: 'Emeka Chukwuma',
      serviceNumber: 'NN/4412/NAVY',
      phone: '+234 802 333 4455',
      targetEstateName: 'Armed Forces Housing Estate (Epe, Lagos)',
      allocatedFlatCode: 'L3H2C',
      laneNumber: 3,
      apartmentType: '3-Bedroom Luxury Apartment',
      totalPropertyCost: 24000000,
      amountPaid: 24000000,
      applicationDate: '2021-08-20',
      approvalStatus: 'fully_paid_allocated',
      approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    },
  ];

  const filtered = allocations.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.serviceNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.allocatedFlatCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>HOUSING ALLOCATION CONTROL</span> • <span>18 NATIONWIDE ESTATES</span></div>
          <h1>Apartment Allocation & Homeownership Management</h1>
          <p>
            Oversee soldier Expression of Interest (EOI), enforce 1-apartment statutory limit, track installment equity, and issue printable deeds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsApplying(true)}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
          >
            <Plus size={14} /> Start New Application (EOI)
          </button>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('admin_flats')}
              className="btn btn-outline btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Building size={14} /> View 400 Flats Roster <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 6, fontWeight: 800 }}>
          {notice}
        </div>
      )}

      {/* Statutory Notice Strip */}
      <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#92400E' }}>
        <Shield size={18} color="#B45309" />
        <div>
          <strong>Statutory Armed Forces Housing Policy:</strong> Personnel are entitled to receive <strong>only one apartment unit</strong> across the 18 PHDL Portfolio Estates nationwide.
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Soldier Name, Service No, or Flat Code..."
          className="form-control"
        />
      </div>

      {/* Allocations Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Soldier Particulars</th>
                <th>Target Estate & Flat</th>
                <th>Equity Progress</th>
                <th>Status</th>
                <th>Allocation Deed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const pct = Math.round((a.amountPaid / a.totalPropertyCost) * 100);
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.applicantRank} {a.applicantName}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.serviceNumber}</div>
                    </td>
                    <td>
                      <strong>Flat {a.allocatedFlatCode}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.targetEstateName}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                        ₦{(a.amountPaid / 1000000).toFixed(1)}M / ₦{(a.totalPropertyCost / 1000000).toFixed(1)}M ({pct}%)
                      </div>
                      <div style={{ width: 100, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 4 }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct === 100 ? '#15803D' : '#F59E0B' }} />
                      </div>
                    </td>
                    <td>
                      {a.approvalStatus === 'fully_paid_allocated' ? (
                        <span className="badge badge-success">✓ Deed Ready</span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Equity Active</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedDeed(a)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', gap: '0.3rem', backgroundColor: '#15803D' }}
                      >
                        <FileText size={12} /> View Official Deed
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* START NEW APPLICATION MODAL */}
      {isApplying && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>New Soldier Expression of Interest (EOI)</h3>
              <button onClick={() => setIsApplying(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreateApplication} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rank:</label>
                  <select value={appRank} onChange={(e) => setAppRank(e.target.value)} className="form-select">
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Lt. Col.">Lt. Col.</option>
                    <option value="Staff Sgt.">Staff Sgt.</option>
                    <option value="Warrant Officer">Warrant Officer</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Soldier Full Name:</label>
                  <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="e.g. Ibrahim Danjuma" className="form-control" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Military Service No:</label>
                  <input type="text" value={appSrv} onChange={(e) => setAppSrv(e.target.value)} placeholder="e.g. NA/5592/ARMY" className="form-control" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number:</label>
                  <input type="text" value={appPhone} onChange={(e) => setAppPhone(e.target.value)} placeholder="+234 803 000 0000" className="form-control" required />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Portfolio Estate (18 Available):</label>
                <select value={appEstate} onChange={(e) => setAppEstate(e.target.value)} className="form-select">
                  {NATIONWIDE_18_ESTATES.map((est) => (
                    <option key={est.id} value={est.id}>{est.name} ({est.state})</option>
                  ))}
                </select>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, fontSize: '0.8rem', color: '#166534' }}>
                ✓ Statutory EOI Form Fee: <strong>₦20,000 (Non-Refundable)</strong> will be logged upon submission.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsApplying(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#15803D' }}>Submit & Register Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL DEED MODAL */}
      {selectedDeed && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 680, backgroundColor: '#FFFFFF', color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #071A0B', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PhdlLogo size={42} />
                <div>
                  <h3 style={{ margin: 0, color: '#071A0B', fontSize: '1.1rem' }}>POST-HOUSING DEVELOPMENT LIMITED</h3>
                  <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 700 }}>ARMED FORCES HOUSING SCHEME • RC 676563</div>
                </div>
              </div>
              <button onClick={() => setSelectedDeed(null)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1B4D21' }}>PROVISIONAL LETTER OF STATUTORY ALLOCATION</h2>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Deed Ref: {selectedDeed.id} • Date: {selectedDeed.applicationDate}</div>
              </div>

              <div>
                This is to officially certify that <strong>{selectedDeed.applicantRank} {selectedDeed.applicantName}</strong> (Service No: <code>{selectedDeed.serviceNumber}</code>) has fulfilled statutory requirements and is hereby allocated:
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 6 }}>
                <div><strong>Estate:</strong> {selectedDeed.targetEstateName}</div>
                <div><strong>Allocated Apartment:</strong> Block Lane {selectedDeed.laneNumber}, Flat {selectedDeed.allocatedFlatCode}</div>
                <div><strong>Apartment Type:</strong> {selectedDeed.apartmentType}</div>
                <div><strong>Equity Clearance:</strong> ₦{selectedDeed.amountPaid.toLocaleString()} (100% Paid in Full)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{selectedDeed.approvalOfficer}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Commandant / Managing Director (PHDL HQ)</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>
                  [ SEALED & VERIFIED BY PHDL HQ ]
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ backgroundColor: '#15803D', gap: '0.4rem' }}>
                <Printer size={14} /> Print Official Deed (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApartmentAllocationsPage;