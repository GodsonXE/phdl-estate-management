import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { Receipt, Printer } from 'lucide-react';

export const BillingManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const invoices = store.getInvoices ? store.getInvoices() : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>MONTHLY REVENUE LEDGER</span> • <span>₦4,000,000 / MO</span></div>
          <h1>Billing & Invoices Management</h1>
          <p>Track automated monthly service charge bills across all 400 flats, reconcile payments, and issue receipts.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Billing Ledger
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Resident / Flat</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{inv.id}</td>
                  <td><strong>{inv.residentName}</strong> ({inv.flatCode})</td>
                  <td style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>₦{inv.amount.toLocaleString()}</td>
                  <td>{inv.dueDate}</td>
                  <td><span className={`badge ${inv.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>{inv.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingManagementPage;