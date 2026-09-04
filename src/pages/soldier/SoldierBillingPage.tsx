import React from 'react';
import { CreditCard, Receipt, Printer, Download, CheckCircle2 } from 'lucide-react';

export const SoldierBillingPage: React.FC = () => {
  const transactions = [
    { id: 'TXN-2026-001', type: 'Rent Collection', amount: 150000, flat: 'Flat L1H2A (Engr. Okon)', date: '2026-09-01', status: 'settled' },
    { id: 'TXN-2026-002', type: 'Service Charge Levy', amount: -10000, flat: 'Flat L1H1A (HQ Service)', date: '2026-09-01', status: 'settled' },
    { id: 'TXN-2026-003', type: 'Rent Collection', amount: 150000, flat: 'Flat L1H2A (Engr. Okon)', date: '2026-08-01', status: 'settled' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>FINANCIAL LEDGER</span> • <span>RENTAL INCOME & LEVIES</span></div>
          <h1>Rental Income & Revenue Ledger</h1>
          <p>Track monthly tenant rental payouts and statutory service charge maintenance debits.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Export Revenue Statement (PDF)
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Description / Unit</th>
                <th>Category</th>
                <th>Amount (₦)</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.id}</td>
                  <td><strong>{t.flat}</strong></td>
                  <td><span className="badge badge-military">{t.type}</span></td>
                  <td style={{ fontWeight: 900, color: t.amount > 0 ? '#15803D' : '#991B1B' }}>
                    {t.amount > 0 ? `+₦${t.amount.toLocaleString()}` : `-₦${Math.abs(t.amount).toLocaleString()}`}
                  </td>
                  <td>{t.date}</td>
                  <td><span className="badge badge-success">✓ Settled</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SoldierBillingPage;