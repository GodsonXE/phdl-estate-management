import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Users, Search, Filter, CheckCircle2, Printer } from 'lucide-react';

export const SoldierOnboardingRegistryPage: React.FC = () => {
  const store = usePhdlStore();
  const [soldiers] = useState(store.getSoldiers ? store.getSoldiers() : []);
  const [search, setSearch] = useState('');

  const filtered = soldiers.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.serviceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.allocatedFlat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>MILITARY ALLOTTEE REGISTRY</span> • <span>288 VERIFIED SOLDIERS</span></div>
          <h1>Soldier Onboarding & Allottee Registry</h1>
          <p>Official registry of military personnel allocated housing across 100 residential houses in PHDL Unity Estate.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Registry
        </button>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Soldier Name, Service Number, or Flat Code..."
          className="form-control"
        />
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Soldier Particulars</th>
                <th>Service Number</th>
                <th>Branch</th>
                <th>Allocated Flat</th>
                <th>Status</th>
                <th>Clearance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.rank} {s.fullName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.phone}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{s.serviceNumber}</td>
                  <td><span className="badge badge-military">{s.branch}</span></td>
                  <td><strong>Flat {s.allocatedFlat}</strong> ({s.lane})</td>
                  <td><span className="badge badge-success">Active Owner</span></td>
                  <td><span className="badge badge-success"><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> Verified KYC</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SoldierOnboardingRegistryPage;