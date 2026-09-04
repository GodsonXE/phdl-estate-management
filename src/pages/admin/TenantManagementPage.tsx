import React, { useState, useEffect } from 'react';
import { usePhdlStore, TenantRecord } from '../../data/storage';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit3,
  Save,
  CheckCircle2,
  Printer,
  Building,
  Building2,
  UserCheck,
  Shield,
  Sparkles,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  CreditCard,
} from 'lucide-react';

const LANE_HOUSES_MAP: { [k: number]: number } = {
  1: 9,
  2: 17,
  3: 18,
  4: 18,
  5: 16,
  6: 8,
  7: 7,
  8: 7,
};

const DEFAULT_TENANTS: TenantRecord[] = [
  {
    id: 't-01',
    fullName: 'Engr. Emeka Gabriel Okon',
    phone: '+234 803 456 7890',
    email: 'emeka.okon@gmail.com',
    flatCode: 'L1H2A',
    lane: 'Lane 1',
    landlordSoldier: 'Staff Sgt. Adamu Mohammed',
    landlordServiceNo: 'NN/8924/ARMY',
    employment: 'Petroleum Engineer, NNPC Ltd',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2025-12-31',
    kycStatus: 'verified',
    monthlyRent: 150000,
    serviceChargeStatus: 'paid',
  },
  {
    id: 't-02',
    fullName: 'Dr. (Mrs) Fatima Abubakar',
    phone: '+234 802 112 3344',
    email: 'fatima.abubakar@abuja.med.ng',
    flatCode: 'L2H3C',
    lane: 'Lane 2',
    landlordSoldier: 'Major Ibrahim Bello',
    landlordServiceNo: 'NA/7712/ARMY',
    employment: 'Medical Consultant, National Hospital',
    leaseStartDate: '2024-11-01',
    leaseEndDate: '2025-10-31',
    kycStatus: 'verified',
    monthlyRent: 180000,
    serviceChargeStatus: 'paid',
  },
  {
    id: 't-03',
    fullName: 'Barrister Oladipo Balogun',
    phone: '+234 806 789 0123',
    email: 'oladipo@balogunlegal.ng',
    flatCode: 'L3H5B',
    lane: 'Lane 3',
    landlordSoldier: 'Lt. Col. Farouk Danjuma (Rtd.)',
    landlordServiceNo: 'NA/3310/ARMY',
    employment: 'Principal Partner, Balogun & Co. Legal',
    leaseStartDate: '2025-02-01',
    leaseEndDate: '2026-01-31',
    kycStatus: 'verified',
    monthlyRent: 200000,
    serviceChargeStatus: 'pending',
  },
];

export const TenantManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const [tenants, setTenants] = useState<TenantRecord[]>(() => {
    const saved = localStorage.getItem('phdl_tenants_registry_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEFAULT_TENANTS;
  });

  const [search, setSearch] = useState('');
  const [selectedLaneFilter, setSelectedLaneFilter] = useState('all');
  const [selectedKycFilter, setSelectedKycFilter] = useState('all');
  
  // Modals
  const [isOnboardingNew, setIsOnboardingNew] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // New Tenant Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmployment, setNewEmployment] = useState('');
  const [newLane, setNewLane] = useState(1);
  const [newHouse, setNewHouse] = useState(1);
  const [newFlatPos, setNewFlatPos] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [newLandlordName, setNewLandlordName] = useState('Staff Sgt. Adamu Mohammed');
  const [newLandlordSrv, setNewLandlordSrv] = useState('NN/8924/ARMY');
  const [newMonthlyRent, setNewMonthlyRent] = useState(150000);
  const [newLeaseStart, setNewLeaseStart] = useState('2026-01-01');
  const [newLeaseEnd, setNewLeaseEnd] = useState('2026-12-31');

  useEffect(() => {
    localStorage.setItem('phdl_tenants_registry_v4', JSON.stringify(tenants));
  }, [tenants]);

  // Quick Pre-Fill Helper
  const handleQuickPreFill = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const sampleNames = ['Dr. Chinedu Eze', 'Amina Yusuf', 'Engr. Segun Ogundimu', 'Ngozi Okeke', 'Tariq Al-Mansoor'];
    const sampleJobs = ['Senior Analyst, Central Bank of Nigeria', 'Senior Software Engineer, TechCorp', 'Principal Consultant, PWC', 'Civil Servant, Federal Ministry of Works'];
    const chosenName = sampleNames[randomSeed % sampleNames.length];

    setNewFullName(chosenName);
    setNewPhone(`+234 80${(randomSeed % 9) + 1} ${(200 + randomSeed) % 900} ${(4000 + randomSeed) % 9000}`);
    setNewEmail(`${chosenName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`);
    setNewEmployment(sampleJobs[randomSeed % sampleJobs.length]);
    setNewLane((randomSeed % 8) + 1);
    setNewHouse(((randomSeed % 6) + 1));
    setNewFlatPos(['A', 'B', 'C', 'D'][randomSeed % 4] as any);
    setNewMonthlyRent(160000 + (randomSeed % 4) * 20000);
  };

  const computedFlatCode = `L${newLane}H${newHouse}${newFlatPos}`;

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TenantRecord = {
      id: `t-${Date.now().toString().slice(-4)}`,
      fullName: newFullName,
      phone: newPhone,
      email: newEmail || `${newFullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      flatCode: computedFlatCode,
      lane: `Lane ${newLane}`,
      landlordSoldier: newLandlordName,
      landlordServiceNo: newLandlordSrv,
      employment: newEmployment || 'Private Professional',
      leaseStartDate: newLeaseStart,
      leaseEndDate: newLeaseEnd,
      kycStatus: 'verified',
      monthlyRent: Number(newMonthlyRent),
      serviceChargeStatus: 'paid',
    };

    setTenants([created, ...tenants]);
    setIsOnboardingNew(false);
    setNotice(`🎉 Tenant profile for ${newFullName} registered to Flat ${computedFlatCode} (Lane ${newLane}, House ${newHouse}, Flat ${newFlatPos})!`);
    setTimeout(() => setNotice(null), 4500);

    // Reset Form
    setNewFullName('');
    setNewPhone('');
    setNewEmail('');
    setNewEmployment('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    const updated = tenants.map((t) => (t.id === editingTenant.id ? editingTenant : t));
    setTenants(updated);
    setEditingTenant(null);
    setNotice(`Tenant profile for ${editingTenant.fullName} updated successfully!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredTenants = tenants.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const mName = t.fullName.toLowerCase().includes(q);
      const mFlat = t.flatCode.toLowerCase().includes(q);
      const mLandlord = t.landlordSoldier.toLowerCase().includes(q);
      const mPhone = t.phone.toLowerCase().includes(q);
      if (!mName && !mFlat && !mLandlord && !mPhone) return false;
    }
    if (selectedLaneFilter !== 'all' && t.lane !== `Lane ${selectedLaneFilter}`) return false;
    if (selectedKycFilter !== 'all' && t.kycStatus !== selectedKycFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>CIVILIAN TENANCY CONTROL</span> • <span>{filteredTenants.length} OF {tenants.length} RESIDENTS DISPLAYED</span>
          </div>
          <h1>Tenant Onboarding & Resident Management</h1>
          <p>
            Onboard subletting civilian residents, verify background KYC, enforce ₦10,000/mo service charge compliance, and allocate structured <strong>Lane, House/Block, and Flat numbers</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              handleQuickPreFill();
              setIsOnboardingNew(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
          >
            <Plus size={14} /> Onboard New Tenant (Quick Create)
          </button>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Printer size={14} /> Print Tenant Roster
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
            <label className="form-label">
              <Search size={14} style={{ display: 'inline', marginRight: 4 }} /> Search Tenant Name, Flat Code, or Landlord:
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Okon, L1H2A, Adamu, +234..."
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Building size={14} style={{ display: 'inline', marginRight: 4 }} /> Filter by Lane:
            </label>
            <select
              value={selectedLaneFilter}
              onChange={(e) => setSelectedLaneFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">-- All 8 Lanes --</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
                <option key={l} value={l.toString()}>Lane {l} ({LANE_HOUSES_MAP[l]} Houses)</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> KYC Status:
            </label>
            <select
              value={selectedKycFilter}
              onChange={(e) => setSelectedKycFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">-- All KYC Statuses --</option>
              <option value="verified">Verified KYC</option>
              <option value="pending">Pending Clearance</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Tenants Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resident Particulars</th>
                <th>Assigned Flat (Lane • Block • Flat)</th>
                <th>Soldier Landlord Owner</th>
                <th>Lease Term</th>
                <th>Service Charge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((t) => {
                const laneNum = t.flatCode.match(/L(\d+)/)?.[1] || '1';
                const houseNum = t.flatCode.match(/H(\d+)/)?.[1] || '1';
                const pos = t.flatCode.slice(-1);

                return (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>{t.fullName}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {t.employment} • 📞 {t.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="badge badge-military" style={{ fontWeight: 800, fontSize: '0.78rem' }}>
                          Flat {t.flatCode}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Lane {laneNum} • House/Block {houseNum} • Flat {pos}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--army-green-950)' }}>
                        {t.landlordSoldier}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {t.landlordServiceNo}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      <div>{t.leaseStartDate} to {t.leaseEndDate}</div>
                      <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700 }}>₦{t.monthlyRent.toLocaleString()}/mo Rent</div>
                    </td>
                    <td>
                      <span className={`badge ${t.serviceChargeStatus === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                        ₦10k {t.serviceChargeStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setEditingTenant({ ...t })}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.72rem', gap: '0.3rem', backgroundColor: '#1B4D21', padding: '0.3rem 0.65rem' }}
                      >
                        <Edit3 size={12} /> Modify Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: ONBOARD NEW TENANT (WITH STRUCTURED LANE, BLOCK & FLAT DETAILS) */}
      {/* ========================================================================= */}
      {isOnboardingNew && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={18} color="#FBBF24" />
                <h3 style={{ margin: 0, color: '#FFFFFF' }}>Onboard New Resident Tenant</h3>
              </div>
              <button onClick={() => setIsOnboardingNew(false)} className="btn btn-outline btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateTenant} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Quick Pre-fill Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.65rem 0.85rem', borderRadius: 6 }}>
                <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
                  ⚡ Need sample data to test? Click Quick Pre-Fill:
                </div>
                <button
                  type="button"
                  onClick={handleQuickPreFill}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#15803D', fontSize: '0.72rem', gap: '0.3rem' }}
                >
                  <Sparkles size={12} /> Quick Pre-Fill
                </button>
              </div>

              {/* 1. PERSONAL DETAILS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Resident Full Name *:</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Engr. Emeka Okon"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number *:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="resident@gmail.com"
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Occupation / Employer *:</label>
                  <input
                    type="text"
                    value={newEmployment}
                    onChange={(e) => setNewEmployment(e.target.value)}
                    placeholder="e.g. Senior Officer, CBN"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* 2. STRUCTURED ASSIGNED FLAT DETAILS (LANE • BLOCK • FLAT) */}
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--army-green-950)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} color="var(--army-green-800)" />
                  Assigned Flat Particulars (Lane • House/Block • Flat Position):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
                  {/* Lane */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">1. Select Lane *:</label>
                    <select
                      value={newLane}
                      onChange={(e) => {
                        const l = Number(e.target.value);
                        setNewLane(l);
                        if (newHouse > LANE_HOUSES_MAP[l]) setNewHouse(1);
                      }}
                      className="form-select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
                        <option key={l} value={l}>
                          Lane {l} ({LANE_HOUSES_MAP[l]} Houses)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* House / Block */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">2. House / Block *:</label>
                    <select
                      value={newHouse}
                      onChange={(e) => setNewHouse(Number(e.target.value))}
                      className="form-select"
                    >
                      {Array.from({ length: LANE_HOUSES_MAP[newLane] || 9 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          House {h} (Block {h})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Flat Position */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">3. Flat Position *:</label>
                    <select
                      value={newFlatPos}
                      onChange={(e) => setNewFlatPos(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="A">Flat A (Ground Left)</option>
                      <option value="B">Flat B (Ground Right)</option>
                      <option value="C">Flat C (Upper Left)</option>
                      <option value="D">Flat D (Upper Right)</option>
                    </select>
                  </div>
                </div>

                {/* COMPUTED FLAT BADGE */}
                <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', backgroundColor: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>OFFICIAL DESIGNATION:</span>
                    <div style={{ fontWeight: 900, color: 'var(--army-green-950)', fontSize: '0.95rem' }}>
                      Flat {computedFlatCode} (Lane {newLane}, House {newHouse}, Flat {newFlatPos})
                    </div>
                  </div>
                  <span className="badge badge-success">400 Flats Verified</span>
                </div>
              </div>

              {/* 3. SOLDIER LANDLORD LINKAGE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Soldier Landlord Owner *:</label>
                  <input
                    type="text"
                    value={newLandlordName}
                    onChange={(e) => setNewLandlordName(e.target.value)}
                    placeholder="e.g. Staff Sgt. Adamu Mohammed"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Soldier Military Service No *:</label>
                  <input
                    type="text"
                    value={newLandlordSrv}
                    onChange={(e) => setNewLandlordSrv(e.target.value)}
                    placeholder="e.g. NN/8924/ARMY"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* 4. LEASE & RENT */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Agreed Monthly Rent (₦):</label>
                  <input
                    type="number"
                    value={newMonthlyRent}
                    onChange={(e) => setNewMonthlyRent(Number(e.target.value))}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Lease Commencement:</label>
                  <input
                    type="date"
                    value={newLeaseStart}
                    onChange={(e) => setNewLeaseStart(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Lease Expiry Date:</label>
                  <input
                    type="date"
                    value={newLeaseEnd}
                    onChange={(e) => setNewLeaseEnd(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsOnboardingNew(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}>
                  <UserCheck size={16} /> Complete Tenant Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: MODIFY EXISTING TENANT */}
      {/* ========================================================================= */}
      {editingTenant && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Modify Tenant Profile: {editingTenant.fullName}</h3>
              <button onClick={() => setEditingTenant(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name:</label>
                <input
                  type="text"
                  value={editingTenant.fullName}
                  onChange={(e) => setEditingTenant({ ...editingTenant, fullName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number:</label>
                  <input
                    type="text"
                    value={editingTenant.phone}
                    onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Assigned Flat Code:</label>
                  <input
                    type="text"
                    value={editingTenant.flatCode}
                    onChange={(e) => setEditingTenant({ ...editingTenant, flatCode: e.target.value.toUpperCase() })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Occupation / Employer:</label>
                <input
                  type="text"
                  value={editingTenant.employment}
                  onChange={(e) => setEditingTenant({ ...editingTenant, employment: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Soldier Landlord Owner:</label>
                  <input
                    type="text"
                    value={editingTenant.landlordSoldier}
                    onChange={(e) => setEditingTenant({ ...editingTenant, landlordSoldier: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Landlord Service No:</label>
                  <input
                    type="text"
                    value={editingTenant.landlordServiceNo}
                    onChange={(e) => setEditingTenant({ ...editingTenant, landlordServiceNo: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingTenant(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#1B4D21', gap: '0.4rem' }}>
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagementPage;