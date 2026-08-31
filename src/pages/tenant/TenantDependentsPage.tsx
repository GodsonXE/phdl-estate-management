import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Dependent } from '../../types';
import { Users, Plus, Trash2, Shield, IdCard, CheckCircle2 } from 'lucide-react';

export const TenantDependentsPage: React.FC = () => {
  const store = usePhdlStore();
  const activeTenantId = store.getActiveTenantId();
  const activeTenant = store.getTenantById(activeTenantId);
  const dependents = store.getDependents(activeTenantId);

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [notice, setNotice] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newDep: Dependent = {
      id: `dep-${Date.now()}`,
      fullName: fullName.trim(),
      relationship,
      age: Number(age),
      gender,
      idCardNumber: `DEP-UNT-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    store.addDependent(newDep, activeTenantId);
    setFullName('');
    setNotice(`Added ${newDep.fullName} to household registry.`);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from household dependents?`)) {
      store.removeDependent(id, activeTenantId);
      setNotice(`Removed ${name}.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-overline">
          <span>SECURITY GATE CLEARANCE</span> • <span>HOUSEHOLD REGISTRY</span>
        </div>
        <h1>Household Dependents & Gate Clearance</h1>
        <p>Register family members and wards residing in Flat {activeTenant?.flatId} to authorize their smart gate access.</p>
      </div>

      {notice && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
          {notice}
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Add New Dependent</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Mary Okon" className="form-control" required />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Relationship</label>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="form-select">
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Ward">Ward</option>
              <option value="Parent">Parent</option>
              <option value="Relative">Relative</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min={1} max={120} className="form-control" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)', height: 38 }}>
            <Plus size={16} /> Add Dependent
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={18} /> Registered Household Members ({dependents.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Relationship</th>
                <th>Age</th>
                <th>Gate ID Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dependents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    No dependents registered yet. Use the form above to add household members.
                  </td>
                </tr>
              ) : (
                dependents.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.fullName}</strong></td>
                    <td>{d.relationship}</td>
                    <td>{d.age} yrs</td>
                    <td><span className="badge badge-military">{d.idCardNumber || 'Active'}</span></td>
                    <td>
                      <button onClick={() => handleRemove(d.id, d.fullName)} className="btn btn-ghost btn-sm" style={{ color: 'var(--army-red-700)' }}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};