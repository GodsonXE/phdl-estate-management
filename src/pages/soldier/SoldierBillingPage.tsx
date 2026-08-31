import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Bill } from '../../types';
import { CreditCard, Receipt, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatNaira, formatDate, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';
import { PaymentModal } from '../../components/billing/PaymentModal';

export const SoldierBillingPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeSoldierId = store.getActiveSoldierId();
  const soldier = store.getSoldierById(activeSoldierId) || store.getSoldiers()[0];
  const allFlats = store.getFlats(currentEstateId);
  const myFlats = allFlats.filter((f) => soldier.ownedFlatIds.includes(f.id));
  const bills = store.getBills(currentEstateId);
  const payments = store.getPayments(currentEstateId);

  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  // Filter bills where soldier is responsible (owner or split)
  const myBills = bills.filter(
    (b) => myFlats.some((f) => f.id === b.flatId) && (b.payerRole === 'owner' || b.payerRole === 'split')
  );

  const myPayments = payments.filter((p) => p.payerId === soldier.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-military">SOLDIER REVENUE DESK</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            {soldier.rank} {soldier.fullName}
          </span>
        </div>
        <h2>My Estate Invoices, Levies & Split Bills</h2>
        <p style={{ fontSize: '0.875rem' }}>
          View and pay landlord-assigned service charges, perimeter security levies, and development contributions.
        </p>
      </div>

      {/* Invoices List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={18} />
            My Invoiced Levies ({myBills.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Target Flat</th>
                <th>Title / Scope</th>
                <th>Your Assigned Share</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myBills.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    No pending bills assigned to your flats at this time.
                  </td>
                </tr>
              ) : (
                myBills.map((bill) => {
                  const flat = myFlats.find((f) => f.id === bill.flatId);
                  const myPortion = (bill.ownerPortion && bill.ownerPortion > 0) ? bill.ownerPortion : (bill.totalAmount || bill.amount || 0);
                  const isPaid = bill.status === 'paid';

                  return (
                    <tr key={bill.id}>
                      <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{bill.invoiceNumber || bill.id}</td>
                      <td>
                        <span className="badge badge-neutral">{flat?.fullFlatCode}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{bill.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{bill.billingPeriod || 'Standard Period'}</div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary-900)' }}>{formatNaira(myPortion)}</td>
                      <td>{formatDate(bill.dueDate)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(bill.status)}`}>
                          {getStatusLabel(bill.status)}
                        </span>
                      </td>
                      <td>
                        {!isPaid ? (
                          <button
                            onClick={() => setPayingBill(bill)}
                            className="btn btn-accent btn-sm"
                            style={{ gap: '0.3rem' }}
                          >
                            <CreditCard size={13} />
                            Pay Now
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>
                            ✓ Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CheckCircle size={18} />
            My Payment Receipts & Settlement History
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt No.</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Method / Gateway</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    No payment history recorded.
                  </td>
                </tr>
              ) : (
                myPayments.map((pay) => (
                  <tr key={pay.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{pay.receiptNumber}</td>
                    <td>{formatDate(pay.paymentDate || pay.paidAt || '2026-01-01')}</td>
                    <td style={{ fontWeight: 800, color: '#15803D' }}>{formatNaira(pay.amountPaid || pay.amount || 0)}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{pay.transactionReference || pay.reference}</td>
                    <td>
                      <span className="badge badge-success">✓ SUCCESSFUL</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {payingBill && (
        <PaymentModal
          bill={payingBill}
          onClose={() => setPayingBill(null)}
          onSuccess={() => setPayingBill(null)}
        />
      )}
    </div>
  );
};
