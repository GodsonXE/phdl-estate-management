import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, Shield, Printer } from 'lucide-react';

export const TenantDependentsPage: React.FC = () => {
  const [dependents, setDependents] = useState([
    { id: 'dep-1', name: 'Mrs. Ngozi Okon', relationship: 'Spouse', phone: '+234 803 999 1122', passRef: 'PHDL-DEP-01', status: 'cleared' },
    { id: 'dep-2', name: 'Chukwudi Okon', relationship: 'Child (Son)', phone: 'N/A', passRef: 'PHDL-DEP-02', status: 'cleared' },
    { id: 'dep-3', name: 'Blessing Udoh', relationship: 'Domestic Assistant', phone: '+234 809 333 4455', passRef: 'PHDL-DEP-03', status: 'cleared' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [rel, setRel] = useState('Spouse');
  const [phone, setPhone] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setDependents([
      ...dependents,
      { id: `dep-${Date.now()}`, name, relationship: rel, phone: phone || 'N/A', passRef: `PHDL-DEP-0${dependents.length + 1}`, status: 'cleared' },
    ]);
    setIsAdding(false);
    setName('');
    setPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>HOUSEHOLD SECURITY CLEARANCE</span> • <span>FLAT L1H2A</span></div>
          <h1>Household Dependents & Gate Clearance</h1>
          <p>Register family members and domestic staff for biometric barcode access at estate perimeter barriers.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setIsAdding(true)} className="btn btn-primary btn-sm" style={{ backgroundColor: '#15803D', gap: '0.4rem', fontWeight: 800 }}>
            <Plus size={14} /> Register Household Member
          </button>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Printer size={14} /> Export Dependents (PDF)
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dependent Name</th>
                <th>Relationship</th>
                <th>Phone Number</th>
                <th>Gate Barcode Ref</th>
                <th>Access Status</th>
              </tr>
            </thead>
            <tbody>
              {dependents.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong></td>
                  <td><span className="badge badge-military">{d.relationship}</span></td>
                  <td>{d.phone}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{d.passRef}</td>
                  <td><span className="badge badge-success">✓ Gate Cleared</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Register Household Member</h3>
              <button onClick={() => setIsAdding(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name *:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Relationship to Resident *:</label>
                <select value={rel} onChange={(e) => setRel(e.target.value)} className="form-select">
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent / Relative">Parent / Relative</option>
                  <option value="Domestic Staff / Driver">Domestic Staff / Driver</option>
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Phone Number:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 803 000 0000" className="form-control" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#15803D' }}>Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantDependentsPage;