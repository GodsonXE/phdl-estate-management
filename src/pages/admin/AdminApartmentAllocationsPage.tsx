import React, { useState } from 'react';
import { usePhdlStore, NATIONWIDE_18_ESTATES } from '../../data/storage';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  Sparkles,
  Building,
  Building2,
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
  TrendingUp,
  MapPin,
  Coins,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface AllocationsPageProps {
  onNavigate?: (page: ActivePage) => void;
}

interface AllocationRecord {
  id: string;
  applicantRank: string;
  applicantName: string;
  serviceNumber: string;
  branch: 'Nigerian Army' | 'Nigerian Navy' | 'Nigerian Air Force';
  phone: string;
  targetEstateId: string;
  targetEstateName: string;
  allocatedFlatCode: string;
  laneNumber: number;
  houseNumber: number;
  apartmentType: string;
  totalPropertyCost: number;
  amountPaid: number;
  monthlyInstallment?: number;
  applicationDate: string;
  approvalStatus: 'fully_paid_allocated' | 'installments_active' | 'pending_vetting';
  approvalOfficer: string;
  deedSerial: string;
}

const INITIAL_ALLOCATIONS: AllocationRecord[] = [
  {
    id: 'ALC-2026-001',
    applicantRank: 'Staff Sergeant',
    applicantName: 'Adamu Mohammed',
    serviceNumber: 'NN/8924/ARMY',
    branch: 'Nigerian Army',
    phone: '+234 803 111 2233',
    targetEstateId: 'estate-kurudu-01',
    targetEstateName: 'PHDL Unity Estate (Kurudu, Abuja FCT)',
    allocatedFlatCode: 'L1H1A',
    laneNumber: 1,
    houseNumber: 1,
    apartmentType: '3-Bedroom Luxury Apartment',
    totalPropertyCost: 22000000,
    amountPaid: 22000000,
    applicationDate: '2022-01-15',
    approvalStatus: 'fully_paid_allocated',
    approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    deedSerial: 'PHDL/DEED/2022/0410',
  },
  {
    id: 'ALC-2026-002',
    applicantRank: 'Captain',
    applicantName: 'Tunde Adeyemi',
    serviceNumber: 'NA/10492/ARMY',
    branch: 'Nigerian Army',
    phone: '+234 809 123 4567',
    targetEstateId: 'estate-kurudu-01',
    targetEstateName: 'PHDL Unity Estate (Kurudu, Abuja FCT)',
    allocatedFlatCode: 'L2H4B',
    laneNumber: 2,
    houseNumber: 4,
    apartmentType: '3-Bedroom Luxury Apartment',
    totalPropertyCost: 22000000,
    amountPaid: 16500000,
    monthlyInstallment: 458333,
    applicationDate: '2023-04-10',
    approvalStatus: 'installments_active',
    approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    deedSerial: 'PHDL/PROV/2023/1102',
  },
  {
    id: 'ALC-2026-003',
    applicantRank: 'Lt. Commander',
    applicantName: 'Emeka Chukwuma',
    serviceNumber: 'NN/4412/NAVY',
    branch: 'Nigerian Navy',
    phone: '+234 802 333 4455',
    targetEstateId: 'estate-epe-04',
    targetEstateName: 'Armed Forces Housing Estate (Epe, Lagos)',
    allocatedFlatCode: 'L3H2C',
    laneNumber: 3,
    houseNumber: 2,
    apartmentType: '3-Bedroom Luxury Apartment',
    totalPropertyCost: 24000000,
    amountPaid: 24000000,
    applicationDate: '2021-08-20',
    approvalStatus: 'fully_paid_allocated',
    approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    deedSerial: 'PHDL/DEED/2021/0820',
  },
  {
    id: 'ALC-2026-004',
    applicantRank: 'Flight Lieutenant',
    applicantName: 'Zainab Bello',
    serviceNumber: 'NAF/5109/AIR',
    branch: 'Nigerian Air Force',
    phone: '+234 805 777 8899',
    targetEstateId: 'estate-kaduna-05',
    targetEstateName: 'Post-Service Estate (Kaduna)',
    allocatedFlatCode: 'L4H1D',
    laneNumber: 4,
    houseNumber: 1,
    apartmentType: '3-Bedroom Luxury Apartment',
    totalPropertyCost: 19500000,
    amountPaid: 13000000,
    monthlyInstallment: 361111,
    applicationDate: '2024-03-01',
    approvalStatus: 'installments_active',
    approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
    deedSerial: 'PHDL/PROV/2024/0301',
  },
];

export const AdminApartmentAllocationsPage: React.FC<AllocationsPageProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const [activeTab, setActiveTab] = useState<'allocations' | 'estates_portfolio' | 'statutory_rules'>('allocations');
  const [allocations, setAllocations] = useState<AllocationRecord[]>(INITIAL_ALLOCATIONS);
  
  const [search, setSearch] = useState('');
  const [estateFilter, setEstateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedDeed, setSelectedDeed] = useState<AllocationRecord | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New Application Form State
  const [appRank, setAppRank] = useState('Captain');
  const [appName, setAppName] = useState('');
  const [appBranch, setAppBranch] = useState<'Nigerian Army' | 'Nigerian Navy' | 'Nigerian Air Force'>('Nigerian Army');
  const [appSrv, setAppSrv] = useState('');
  const [appPhone, setAppPhone] = useState('');
  const [appEstateId, setAppEstateId] = useState('estate-kurudu-01');
  const [appApartmentType, setAppApartmentType] = useState('3-Bedroom Luxury Apartment');
  const [appValuation, setAppValuation] = useState(22000000);
  const [appInitialDeposit, setAppInitialDeposit] = useState(6600000);
  const [appPaymentPlan, setAppPaymentPlan] = useState<'full_cash' | '24_months' | '36_months'>('24_months');

  // Statistics
  const totalAllocated = allocations.length;
  const totalValuation = allocations.reduce((sum, a) => sum + a.totalPropertyCost, 0);
  const totalMobilized = allocations.reduce((sum, a) => sum + a.amountPaid, 0);
  const fullyPaidCount = allocations.filter((a) => a.approvalStatus === 'fully_paid_allocated').length;

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEstate = NATIONWIDE_18_ESTATES.find((e) => e.id === appEstateId) || NATIONWIDE_18_ESTATES[0];
    const generatedFlatCode = `L${(allocations.length % 8) + 1}H${(allocations.length % 7) + 1}A`;
    const isFullyPaid = appInitialDeposit >= appValuation;

    const newAllocation: AllocationRecord = {
      id: `ALC-2026-00${allocations.length + 1}`,
      applicantRank: appRank,
      applicantName: appName,
      serviceNumber: appSrv.toUpperCase(),
      branch: appBranch,
      phone: appPhone,
      targetEstateId: appEstateId,
      targetEstateName: targetEstate.name,
      allocatedFlatCode: generatedFlatCode,
      laneNumber: (allocations.length % 8) + 1,
      houseNumber: (allocations.length % 7) + 1,
      apartmentType: appApartmentType,
      totalPropertyCost: Number(appValuation),
      amountPaid: Number(appInitialDeposit),
      monthlyInstallment: isFullyPaid ? 0 : Math.round((appValuation - appInitialDeposit) / 24),
      applicationDate: new Date().toISOString().split('T')[0],
      approvalStatus: isFullyPaid ? 'fully_paid_allocated' : 'installments_active',
      approvalOfficer: 'Col. Farouk Danjuma (Rtd.)',
      deedSerial: `PHDL/${isFullyPaid ? 'DEED' : 'PROV'}/2026/00${allocations.length + 1}`,
    };

    setAllocations([newAllocation, ...allocations]);
    setIsApplying(false);
    setNotice(`🎉 Application registered for ${appRank} ${appName} (${appSrv})! Allocated ${generatedFlatCode} in ${targetEstate.name}. ₦20,000 EOI Form fee confirmed.`);
    setTimeout(() => setNotice(null), 5000);

    // Reset Form
    setAppName('');
    setAppSrv('');
    setAppPhone('');
  };

  const filteredAllocations = allocations.filter((a) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const mName = a.applicantName.toLowerCase().includes(q);
      const mSrv = a.serviceNumber.toLowerCase().includes(q);
      const mFlat = a.allocatedFlatCode.toLowerCase().includes(q);
      const mEstate = a.targetEstateName.toLowerCase().includes(q);
      if (!mName && !mSrv && !mFlat && !mEstate) return false;
    }
    if (estateFilter !== 'all' && a.targetEstateId !== estateFilter) return false;
    if (statusFilter !== 'all' && a.approvalStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE COMMAND HEADER & ACTION CONTROLS */}
      {/* ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #071A0B 0%, #0D3315 100%)',
          borderRadius: 12,
          padding: '1.75rem',
          color: '#FFFFFF',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 20, backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#FCD34D', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.65rem' }}>
              <Shield size={13} color="#FBBF24" />
              <span>DEFENCE HEADQUARTERS HOUSING SCHEME • 18 NATIONWIDE ESTATES</span>
            </div>
            <h1 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.55rem', fontWeight: 900, letterSpacing: '0.02em' }}>
              Apartment Allocation & Homeownership Management
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '0.85rem', margin: '0.4rem 0 0 0', maxWidth: 740, lineHeight: 1.5 }}>
              Manage military Expression of Interest (EOI), enforce statutory <strong>1-apartment entitlement per officer</strong>, monitor installment equity accounts, and issue sealed statutory deeds.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setIsApplying(true)}
              className="btn btn-primary btn-sm"
              style={{
                backgroundColor: '#15803D',
                gap: '0.45rem',
                fontWeight: 800,
                padding: '0.6rem 1.1rem',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.4)',
              }}
            >
              <Plus size={16} /> Start New Application (EOI)
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('admin_flats')}
                className="btn btn-outline btn-sm"
                style={{
                  gap: '0.45rem',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  fontWeight: 700,
                  padding: '0.6rem 1rem',
                }}
              >
                <Building size={15} /> 400 Flats Roster <ArrowRight size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline btn-sm"
              style={{
                gap: '0.45rem',
                borderColor: '#F59E0B',
                color: '#FCD34D',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fontWeight: 700,
                padding: '0.6rem 1rem',
              }}
            >
              <Printer size={15} /> Export Allocation Schedule (PDF)
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <CheckCircle2 size={18} /> {notice}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADVANCED FINANCIAL & CAPACITY METRIC CARDS */}
      {/* ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Metric 1 */}
        <div className="card stat-card" style={{ borderLeft: '4px solid #15803D' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL EQUITY MOBILIZED</span>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={17} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 6 }}>
            ₦{(totalMobilized / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700, marginTop: 4 }}>
            Out of ₦{(totalValuation / 1000000).toFixed(1)}M Total Portfolio Value
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card stat-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>18 SCHEMES COVERAGE</span>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={17} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 6 }}>
            18 Estates
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Abuja, Lagos, Kaduna, Port Harcourt, Enugu...
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card stat-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SEALED DEEDS OF ALLOCATION</span>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck2 size={17} color="#2563EB" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 6 }}>
            {fullyPaidCount} / {totalAllocated} Deeds
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, marginTop: 4 }}>
            100% Equity Paid & Ready for Deed Print
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card stat-card" style={{ borderLeft: '4px solid #991B1B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ANTI-HOARDING STATUS</span>
            <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={17} color="#991B1B" />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 6 }}>
            100% Enforced
          </div>
          <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700, marginTop: 4 }}>
            Strict 1-Apartment Limit per Officer
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEGMENTED NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('allocations')}
          className={`btn btn-sm ${activeTab === 'allocations' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'allocations' ? '#1B4D21' : 'transparent', fontWeight: 800 }}
        >
          <FileText size={14} /> Active Allocations & Installment Ledger ({allocations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('estates_portfolio')}
          className={`btn btn-sm ${activeTab === 'estates_portfolio' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'estates_portfolio' ? '#1B4D21' : 'transparent', fontWeight: 800 }}
        >
          <Building2 size={14} /> 18 Nationwide Portfolio Schemes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statutory_rules')}
          className={`btn btn-sm ${activeTab === 'statutory_rules' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'statutory_rules' ? '#1B4D21' : 'transparent', fontWeight: 800 }}
        >
          <Shield size={14} /> DHQ Housing Directives & Policies
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE ALLOCATIONS TABLE */}
      {/* ========================================================================= */}
      {activeTab === 'allocations' && (
        <>
          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Search Soldier Name, Service No, or Flat Code:</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Adamu, NN/8924, L1H1A, Epe..."
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Filter by Estate (18 Available):</label>
                <select value={estateFilter} onChange={(e) => setEstateFilter(e.target.value)} className="form-select">
                  <option value="all">-- All 18 Nationwide Estates --</option>
                  {NATIONWIDE_18_ESTATES.map((est) => (
                    <option key={est.id} value={est.id}>{est.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Equity Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
                  <option value="all">-- All Statuses --</option>
                  <option value="fully_paid_allocated">100% Fully Paid (Deed Ready)</option>
                  <option value="installments_active">Installments Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Soldier Allottee</th>
                    <th>Target Estate & Housing Unit</th>
                    <th>Equity Account Progress</th>
                    <th>Deed Status</th>
                    <th>Official Statutory Deed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllocations.map((a) => {
                    const pct = Math.round((a.amountPaid / a.totalPropertyCost) * 100);
                    const remaining = a.totalPropertyCost - a.amountPaid;

                    return (
                      <tr key={a.id}>
                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
                            {a.applicantRank} {a.applicantName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{a.serviceNumber}</span> • {a.branch}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📞 {a.phone}</div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span className="badge badge-military" style={{ fontWeight: 800 }}>Flat {a.allocatedFlatCode}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lane {a.laneNumber}</span>
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#1E293B', fontWeight: 600, marginTop: 2 }}>
                            {a.targetEstateName}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.apartmentType}</div>
                        </td>

                        <td>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                            <span>₦{(a.amountPaid / 1000000).toFixed(1)}M / ₦{(a.totalPropertyCost / 1000000).toFixed(1)}M</span>
                            <span style={{ color: pct === 100 ? '#15803D' : '#D97706' }}>{pct}%</span>
                          </div>

                          <div style={{ width: '100%', height: 7, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', margin: '4px 0' }}>
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                backgroundColor: pct === 100 ? '#15803D' : '#D97706',
                                borderRadius: 4,
                              }}
                            />
                          </div>

                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {pct === 100 ? (
                              <span style={{ color: '#15803D', fontWeight: 700 }}>✓ Zero Balance Outstanding</span>
                            ) : (
                              <span>₦{(remaining / 1000000).toFixed(2)}M Balance • ₦{a.monthlyInstallment?.toLocaleString()}/mo</span>
                            )}
                          </div>
                        </td>

                        <td>
                          {a.approvalStatus === 'fully_paid_allocated' ? (
                            <span className="badge badge-success" style={{ fontWeight: 800 }}>✓ Deed Sealed</span>
                          ) : (
                            <span className="badge badge-warning" style={{ fontWeight: 800 }}>Provisional (Equity Active)</span>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedDeed(a)}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.74rem', gap: '0.35rem', backgroundColor: '#15803D' }}
                          >
                            <FileText size={13} /> View Official Deed
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 18 NATIONWIDE PORTFOLIO ESTATES GRID */}
      {/* ========================================================================= */}
      {activeTab === 'estates_portfolio' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {NATIONWIDE_18_ESTATES.map((est, idx) => (
            <div key={est.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid #15803D' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-military" style={{ fontSize: '0.68rem' }}>Scheme #{idx + 1}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>EOI Open</span>
                </div>

                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'var(--army-green-950)' }}>
                  {est.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.85rem' }}>
                  <MapPin size={13} color="#15803D" /> {est.state}
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 6, border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Total Flats:</span>
                    <div style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>{est.totalFlats} Units</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Residential Houses:</span>
                    <div style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>{est.totalHouses} Houses</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>✓ DHQ Statutory Allotment</span>
                <button
                  type="button"
                  onClick={() => {
                    setAppEstateId(est.id);
                    setIsApplying(true);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.72rem', gap: '0.25rem' }}
                >
                  <Plus size={11} /> Apply Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DHQ STATUTORY RULES & ANTI-HOARDING DIRECTIVES */}
      {/* ========================================================================= */}
      {activeTab === 'statutory_rules' && (
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={22} color="#15803D" />
            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>
              Defence Headquarters Housing Allotment Directives & Guidelines
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', lineHeight: 1.6, color: '#334155' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: 8, border: '1px solid #FDE68A', color: '#92400E' }}>
              <strong>1. Statutory 1-Apartment Limit per Personnel:</strong> Under Armed Forces Scheme regulations, serving or retired officers are legally entitled to only <strong>ONE residential allotment</strong> across the entire 18 nationwide portfolio schemes.
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong>2. Expression of Interest (EOI) Fee:</strong> An official application processing fee of <strong>₦20,000 (Non-Refundable)</strong> is mandatory for all Expression of Interest submissions.
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong>3. Subletting & Civilian Tenancy:</strong> Allottees who wish to sublet their apartments must register their civilian tenants through the <strong>Tenant Residents Registry</strong> and ensure 100% compliance with the monthly ₦10,000 service charge.
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <strong>4. Deed Issuance & Forfeiture:</strong> Statutory Letters of Allocation and Sealed Deeds are issued upon attaining 100% equity clearance. Defaulting on 24-month installment schedules attracts formal DHQ administrative review.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: START NEW APPLICATION (EOI) */}
      {/* ========================================================================= */}
      {isApplying && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#FBBF24" />
                <h3 style={{ margin: 0, color: '#FFFFFF' }}>New Soldier Expression of Interest (EOI)</h3>
              </div>
              <button onClick={() => setIsApplying(false)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateApplication} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Personal Particulars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Military Rank *:</label>
                  <select value={appRank} onChange={(e) => setAppRank(e.target.value)} className="form-select">
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Lt. Col.">Lt. Col.</option>
                    <option value="Colonel">Colonel</option>
                    <option value="Staff Sergeant">Staff Sergeant</option>
                    <option value="Warrant Officer">Warrant Officer</option>
                    <option value="Master Warrant Officer">Master Warrant Officer</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Armed Forces Branch *:</label>
                  <select value={appBranch} onChange={(e) => setAppBranch(e.target.value as any)} className="form-select">
                    <option value="Nigerian Army">Nigerian Army</option>
                    <option value="Nigerian Navy">Nigerian Navy</option>
                    <option value="Nigerian Air Force">Nigerian Air Force</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Service Number *:</label>
                  <input
                    type="text"
                    value={appSrv}
                    onChange={(e) => setAppSrv(e.target.value)}
                    placeholder="e.g. NA/8924/ARMY"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Soldier Full Name *:</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g. Ibrahim Danjuma"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number *:</label>
                  <input
                    type="text"
                    value={appPhone}
                    onChange={(e) => setAppPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Target Scheme & Apartment */}
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8 }}>
                <div className="form-group" style={{ margin: '0 0 0.75rem 0' }}>
                  <label className="form-label">Target Portfolio Estate (18 Schemes Nationwide) *:</label>
                  <select value={appEstateId} onChange={(e) => setAppEstateId(e.target.value)} className="form-select">
                    {NATIONWIDE_18_ESTATES.map((est) => (
                      <option key={est.id} value={est.id}>{est.name} ({est.state})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Apartment Configuration:</label>
                    <select value={appApartmentType} onChange={(e) => setAppApartmentType(e.target.value)} className="form-select">
                      <option value="3-Bedroom Luxury Apartment">3-Bedroom Luxury Apartment (₦22.0M)</option>
                      <option value="2-Bedroom Executive Apartment">2-Bedroom Executive Apartment (₦18.5M)</option>
                      <option value="4-Bedroom Semi-Detached Duplex">4-Bedroom Semi-Detached Duplex (₦32.0M)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Initial Equity Deposit (₦) *:</label>
                    <input
                      type="number"
                      value={appInitialDeposit}
                      onChange={(e) => setAppInitialDeposit(Number(e.target.value))}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Notice */}
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, fontSize: '0.8rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Statutory EOI Form Fee: <strong>₦20,000 (Non-Refundable)</strong> will be registered to Central Bank Treasury.</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsApplying(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#15803D', fontWeight: 800 }}>
                  Register EOI & Allocate Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: OFFICIAL STATUTORY ALLOCATION DEED */}
      {/* ========================================================================= */}
      {selectedDeed && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 720, backgroundColor: '#FFFFFF', color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #071A0B', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PhdlLogo size={46} />
                <div>
                  <h3 style={{ margin: 0, color: '#071A0B', fontSize: '1.15rem' }}>POST-HOUSING DEVELOPMENT LIMITED</h3>
                  <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800 }}>ARMED FORCES HOUSING SCHEME • RC 676563</div>
                </div>
              </div>
              <button onClick={() => setSelectedDeed(null)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.75rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1B4D21', letterSpacing: '0.04em' }}>
                  PROVISIONAL LETTER OF STATUTORY ALLOCATION
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                  Deed Serial: <strong>{selectedDeed.deedSerial}</strong> • Reference: <strong>{selectedDeed.id}</strong> • Date: <strong>{selectedDeed.applicationDate}</strong>
                </div>
              </div>

              <div>
                This is to officially certify that <strong>{selectedDeed.applicantRank} {selectedDeed.applicantName}</strong> (Service No: <code>{selectedDeed.serviceNumber}</code>, {selectedDeed.branch}) having satisfied statutory requirements is hereby formally allocated:
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', padding: '1.25rem', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div><strong>Estate Scheme:</strong> {selectedDeed.targetEstateName}</div>
                <div><strong>Allocated Apartment:</strong> Block Lane {selectedDeed.laneNumber}, House {selectedDeed.houseNumber}, <strong>Flat {selectedDeed.allocatedFlatCode}</strong></div>
                <div><strong>Apartment Type:</strong> {selectedDeed.apartmentType}</div>
                <div><strong>Equity Clearance:</strong> ₦{selectedDeed.amountPaid.toLocaleString()} ({selectedDeed.approvalStatus === 'fully_paid_allocated' ? '100% Fully Settled' : 'Installments Active'})</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 900, color: '#0F172A' }}>{selectedDeed.approvalOfficer}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Managing Director / Commandant (PHDL HQ)</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#15803D', fontWeight: 800 }}>
                  [ SEALED & VERIFIED BY PHDL HQ RC 676563 ]
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}>
                <Printer size={15} /> Print Official Deed (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApartmentAllocationsPage;