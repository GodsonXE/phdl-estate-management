import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { PaymentModal } from '../../components/billing/PaymentModal';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Download,
  Printer,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

export const TenantBillingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPaidCurrent, setHasPaidCurrent] = useState(false);
  const [receiptNo, setReceiptNo] = useState('RCP-PHDL-928410');

  const history = [
    { id: 'INV-2026-009', month: 'September 2026', amount: 10000, status: hasPaidCurrent ? 'paid' : 'pending', date: '2026-09-01' },
    { id: 'INV-2026-008', month: 'August 2026', amount: 10000, status: 'paid', date: '2026-08-03' },
    { id: 'INV-2026-007', month: 'July 2026', amount: 10000, status: 'paid', date: '2026-07-02' },
  ];

  const handlePaymentSuccess = (rcp: string) => {
    setReceiptNo(rcp);
    setHasPaidCurrent(true);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>ESTATE LEVIES & SETTLEMENTS</span> • <span>₦10,000 / MONTH</span></div>
          <h1>Service Charge Billing & Levies</h1>
          <p>Pay statutory monthly estate service charge (central security patrol, borehole water distribution, and lighting).</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Export Billing Ledger (PDF)
        </button>
      </div>

      {/* Payment Action Banner */}
      <div className="card" style={{ padding: '1.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 800 }}>SEPTEMBER 2026 INVOICE:</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#071A0B', margin: '4px 0' }}>₦10,000.00</div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>
            {hasPaidCurrent ? '✓ Settled & Verified for Flat L1H2A' : 'Due Date: September 5, 2026'}
          </div>
        </div>

        {!hasPaidCurrent ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#15803D', padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.92rem', gap: '0.5rem' }}
          >
            <CreditCard size={18} /> Pay ₦10,000 Now (Paystack / Remita)
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #BBF7D0' }}>
            <CheckCircle2 size={20} color="#15803D" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#166534' }}>Paid in Full</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Ref: {receiptNo}</div>
            </div>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)', fontWeight: 800 }}>
          Payment History & Receipts
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Billing Cycle</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{h.id}</td>
                  <td><strong>{h.month}</strong></td>
                  <td>₦{h.amount.toLocaleString()}</td>
                  <td>{h.date}</td>
                  <td>
                    <span className={`badge ${h.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                      {h.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {h.status === 'paid' ? (
                      <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ fontSize: '0.72rem', gap: '0.3rem' }}>
                        <Download size={12} /> Receipt (PDF)
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>Unpaid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={10000}
        description="September 2026 Estate Monthly Service Charge (Flat L1H2A)"
        invoiceId="INV-2026-009"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default TenantBillingPage;