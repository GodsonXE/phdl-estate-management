import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { CreditCard, Edit3, Save, Printer, Download } from 'lucide-react';

export const AdminTariffsManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const [tariffs, setTariffs] = useState(store.getTariffs ? store.getTariffs() : []);
  const [editing, setEditing] = useState<any | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setTariffs(tariffs.map((t) => (t.id === editing.id ? editing : t)));
    setEditing(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>FINANCIAL CONTROL</span> • <span>ESTATE TARIFF MATRIX</span></div>
          <h1>Tariffs & Levies Management</h1>
          <p>Set statutory estate service fees, smart ID card issuance charges, and transformer maintenance levies.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Download size={14} /> Export Tariff Schedule (PDF)
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tariff Name</th>
                <th>Amount (₦)</th>
                <th>Billing Cycle</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--army-green-950)' }}>₦{t.amount.toLocaleString()}</td>
                  <td><span className="badge badge-military">{t.frequency}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.description}</td>
                  <td>
                    <button onClick={() => setEditing({ ...t })} className="btn btn-outline btn-sm" style={{ fontSize: '0.72rem' }}>
                      <Edit3 size={12} /> Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Adjust Tariff: {editing.name}</h3>
              <button onClick={() => setEditing(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Amount (₦):</label>
                <input type="number" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} className="form-control" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setEditing(null)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Update Tariff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTariffsManagementPage;