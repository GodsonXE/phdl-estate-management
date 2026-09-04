import React, { useState } from 'react';
import { usePhdlStore, EstateFlat } from '../../data/storage';
import {
  Users,
  Plus,
  Edit3,
  CheckCircle2,
  Building,
  Building2,
  Phone,
  Printer,
  Save,
  Sparkles,
} from 'lucide-react';

export const SoldierTenantsPage: React.FC = () => {
  const store = usePhdlStore();
  const flats: EstateFlat[] = store.getFlats ? store.getFlats() : [];

  const [tenants, setTenants] = useState([
    {
      id: 'st-01',
      fullName: 'Engr. Emeka Gabriel Okon',
      phone: '+234 803 456 7890',
      email: 'emeka.okon@gmail.com',
      flatCode: 'L1H2A',
      monthlyRent: 150000,
      leaseStartDate: '2025-01-01',
      leaseEndDate: '2025-12-31',
      status: 'active',
      serviceChargeStatus: 'paid',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('L1H1A');
  const [rent, setRent] = useState(150000);
  const [notice, setNotice] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `st-${Date.now()}`,
      fullName: name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      flatCode: selectedFlat,
      monthlyRent: Number(rent),
      leaseStartDate: '2026-01-01',
      leaseEndDate: '2026-12-31',
      status: 'active',
      serviceChargeStatus: 'paid',
    };
    setTenants([...tenants, created]);
    setIsAdding(false);
    setName('');
    setPhone('');
    setNotice(`Tenant ${name} registered to Flat ${selectedFlat}!`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>SOLDIER LANDLORD PORTAL</span> • <span>SUBLET TENANCY REGISTRY</span>
          </div>
          <h1>My Sublet Tenants & Leases</h1>
          <p>Manage civilian occupants in your allocated properties, monitor lease agreements, and track rental yields.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="btn btn-primary btn-sm"
          style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}
        >
          <Plus size={14} /> Add Sublet Tenant
        </button>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 6, fontWeight: 800 }}>
          {notice}
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Occupied Flat</th>
                <th>Contact</th>
                <th>Lease Term</th>
                <th>Monthly Rent</th>
                <th>Service Charge</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.fullName}</strong></td>
                  <td><span className="badge badge-military">Flat {t.flatCode}</span></td>
                  <td>{t.phone}</td>
                  <td style={{ fontSize: '0.78rem' }}>{t.leaseStartDate} to {t.leaseEndDate}</td>
                  <td style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>₦{t.monthlyRent.toLocaleString()}/mo</td>
                  <td><span className="badge badge-success">₦10k Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Add Sublet Tenant</h3>
              <button onClick={() => setIsAdding(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tenant Full Name *:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number *:</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Monthly Rent (₦):</label>
                  <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="form-control" required />
                </div>
              </div>

              {/* FIXED 400 FLATS SELECTOR */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Select Allocated Flat *:</label>
                <select value={selectedFlat} onChange={(e) => setSelectedFlat(e.target.value)} className="form-select" required>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((laneNum) => {
                    const laneFlats = flats.filter((f) => f.laneNumber === laneNum);
                    return (
                      <optgroup key={laneNum} label={`📍 Lane ${laneNum} (${laneFlats.length} Flats)`}>
                        {laneFlats.map((f) => (
                          <option key={f.id || f.flatCode} value={f.flatCode}>
                            Flat {f.flatCode} — Lane {f.laneNumber}, House {f.houseNumber}{f.flatPosition} • {f.apartmentType}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#15803D' }}>Save Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldierTenantsPage;