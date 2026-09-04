import React, { useState } from 'react';
import { usePhdlStore, EstateFlat } from '../../data/storage';
import {
  FileText,
  Building2,
  User,
  Shield,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Printer,
  CheckCircle2,
  Save,
  Sparkles,
} from 'lucide-react';

export const TenantProfilePage: React.FC = () => {
  const store = usePhdlStore();
  const flats: EstateFlat[] = store.getFlats ? store.getFlats() : [];

  const [fullName, setFullName] = useState('Engr. Emeka Gabriel Okon');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [email, setEmail] = useState('emeka.okon@gmail.com');
  const [employment, setEmployment] = useState('Petroleum Systems Engineer, NNPC Ltd');
  const [selectedFlatCode, setSelectedFlatCode] = useState('L1H2A');
  const [landlordName, setLandlordName] = useState('Staff Sgt. Adamu Mohammed');
  const [landlordSrv, setLandlordSrv] = useState('NN/8924/ARMY');
  const [monthlyRent, setMonthlyRent] = useState(150000);
  const [leaseStart, setLeaseStart] = useState('2025-01-01');
  const [leaseEnd, setLeaseEnd] = useState('2025-12-31');
  const [notice, setNotice] = useState<string | null>(null);

  const selectedFlat = flats.find((f) => f.flatCode === selectedFlatCode) || flats[0];

  const handleFlatChange = (code: string) => {
    setSelectedFlatCode(code);
    const target = flats.find((f) => f.flatCode === code);
    if (target && target.soldierOwner !== 'Unallocated') {
      setLandlordName(target.soldierOwner);
      setLandlordSrv(target.serviceNo);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(`✅ Tenancy Profile & Agreement for ${fullName} in Flat ${selectedFlatCode} saved!`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>RESIDENT TENANT PORTAL</span> • <span>TENANCY LEASE AGREEMENT</span>
          </div>
          <h1>Resident Tenancy Profile & Agreement</h1>
          <p>
            Official tenancy profile, allocated apartment details, landlord particulars, and printable statutory tenancy deed.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Tenancy Agreement
        </button>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* 2. Main Profile & Flat Assignment Form */}
      <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>
          1. Resident Identification & KYC Particulars
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Resident Full Name *:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number *:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address *:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Place of Employment / Business *:</label>
            <input
              type="text"
              value={employment}
              onChange={(e) => setEmployment(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ASSIGNED FLAT NUMBER (FULL 400 FLATS DIRECTORY) */}
        {/* ========================================================================= */}
        <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--army-green-950)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={16} color="var(--army-green-800)" />
            Assigned Flat Number * (100 Houses across 8 Lanes):
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select
              value={selectedFlatCode}
              onChange={(e) => handleFlatChange(e.target.value)}
              className="form-select"
              style={{ fontWeight: 600, fontSize: '0.88rem' }}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((laneNum) => {
                const laneFlats = flats.filter((f) => f.laneNumber === laneNum);
                return (
                  <optgroup
                    key={laneNum}
                    label={`📍 Lane ${laneNum} (${laneFlats.length} Flats: L${laneNum}H1A to L${laneNum}H${laneFlats.length / 4}D)`}
                  >
                    {laneFlats.map((f) => (
                      <option key={f.id || f.flatCode} value={f.flatCode}>
                        Flat {f.flatCode} — Lane {f.laneNumber}, House {f.houseNumber} (Flat {f.flatPosition}) • {f.apartmentType}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {selectedFlat && (
            <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>CANONICAL FLAT DESIGNATION:</div>
                <div style={{ fontWeight: 900, color: 'var(--army-green-950)', fontSize: '1rem' }}>
                  Flat {selectedFlat.flatCode} • Lane {selectedFlat.laneNumber}, House {selectedFlat.houseNumber} (Position {selectedFlat.flatPosition})
                </div>
                <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600, marginTop: 2 }}>
                  Prepaid Meter Ref: {selectedFlat.meterNumber || 'MTR-PHDL-1042'}
                </div>
              </div>
              <span className="badge badge-success">Active Registered Flat</span>
            </div>
          )}
        </div>

        {/* 4. SOLDIER LANDLORD LINKAGE */}
        <h3 style={{ margin: '0.5rem 0 0', color: 'var(--army-green-950)' }}>
          2. Soldier Landlord (Allottee) Particulars
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Soldier Landlord Owner:</label>
            <input
              type="text"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Military Service Number:</label>
            <input
              type="text"
              value={landlordSrv}
              onChange={(e) => setLandlordSrv(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* 5. LEASE TERM & RENT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Agreed Monthly Rent (₦):</label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Lease Commencement:</label>
            <input
              type="date"
              value={leaseStart}
              onChange={(e) => setLeaseStart(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Lease Expiry Date:</label>
            <input
              type="date"
              value={leaseEnd}
              onChange={(e) => setLeaseEnd(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start', gap: '0.4rem', backgroundColor: '#1B4D21', padding: '0.65rem 1.25rem', fontWeight: 800 }}
        >
          <Save size={15} /> Save Tenancy Agreement Particulars
        </button>
      </form>
    </div>
  );
};

export default TenantProfilePage;