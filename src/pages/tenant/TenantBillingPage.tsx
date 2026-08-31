import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Bill } from '../../types';
import { CreditCard, Receipt, Shield, CheckCircle2, AlertCircle, Sparkles, Clock, Check } from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';
import { PaymentModal } from '../../components/billing/PaymentModal';

export const TenantBillingPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeTenantId = store.getActiveTenantId();
  const activeTenant = store.getTenantById(activeTenantId);
  const flats = store.getFlats(currentEstateId) || [];
  const flat = flats.find((f) => f.id === activeTenant?.flatId);
  const bills = store.getBills(currentEstateId) || [];

  const tariff = store.getTariffSettings();
  const [selectedBulkMonths, setSelectedBulkMonths] = useState<3 | 6 | 12>(3);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);

  const tenantBills = bills.filter((b) => b.tenantId === activeTenantId || b.flatId === flat?.id);
  const unpaidBills = tenantBills.filter((b) => b.status === 'unpaid' || b.status === 'overdue');

  const getBulkRate = (months: 3 | 6 | 12): number => {
    if (months === 3) return tariff.activeBulkCharges?.threeMonths || tariff.threeMonthsAmount || 30000;
    if (months === 6) return tariff.activeBulkCharges?.sixMonths || tariff.sixMonthsAmount || 60000;
    return tariff.activeBulkCharges?.annual || tariff.annualAmount || 120000;
  };

  const handleGenerateBulkBill = () => {
    const amount = getBulkRate(selectedBulkMonths);
    const newBill: Bill = {
      id: `bill-sc-${Date.now()}`,
      estateId: currentEstateId,
      flatId: flat?.id || 'L1H1A',
      tenantId: activeTenantId,
      billType: 'service_charge',
      title: `${selectedBulkMonths}-Month Standard Service Charge Levy (₦10,000/mo)`,
      amount,
      totalAmount: amount,
      billingPeriodMonths: selectedBulkMonths,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    };
    store.createBill(newBill);
    setSelectedBillForPayment(newBill);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-overline">
          <span>STANDARD ESTATE LEVIES</span> • <span>₦10,000 / MONTH</span>
        </div>
        <h1>Pay Estate Utility Bills & Service Levies</h1>
        <p>Service charges in PHDL Unity Estate are standardized at ₦10,000/month payable exclusively in 3, 6, or 12-month bulk bundles.</p>
      </div>

      {/* Bulk Tier Payment Selector */}
      <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--army-gold-500)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="var(--army-gold-600)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--army-green-950)' }}>
            Select Mandatory Service Charge Bulk Tier
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {[3, 6, 12].map((m) => {
            const months = m as 3 | 6 | 12;
            const cost = getBulkRate(months);
            const isSelected = selectedBulkMonths === months;

            return (
              <div
                key={months}
                onClick={() => setSelectedBulkMonths(months)}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--army-green-800)' : '1px solid var(--border-light)',
                  backgroundColor: isSelected ? 'var(--army-green-50)' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--army-green-950)' }}>{months} Months</strong>
                  {isSelected && <Check size={18} color="var(--army-green-800)" />}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--army-green-900)' }}>
                  {formatNaira(cost)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>₦10,000 / month</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleGenerateBulkBill} className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}>
            <CreditCard size={16} /> Pay {formatNaira(getBulkRate(selectedBulkMonths))} Now
          </button>
        </div>
      </div>

      {/* Unpaid Bills Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={18} /> Outstanding Invoices ({unpaidBills.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Title</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unpaidBills.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    ✓ No outstanding bills. Your account is in good standing!
                  </td>
                </tr>
              ) : (
                unpaidBills.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.title}</strong></td>
                    <td>{formatDate(b.dueDate)}</td>
                    <td style={{ fontWeight: 800, color: 'var(--army-green-900)' }}>{formatNaira(b.totalAmount || b.amount || 0)}</td>
                    <td><span className="badge badge-warning">Unpaid</span></td>
                    <td>
                      <button onClick={() => setSelectedBillForPayment(b)} className="btn btn-primary btn-sm">
                        Pay Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBillForPayment && (
        <PaymentModal
          bill={selectedBillForPayment}
          onClose={() => setSelectedBillForPayment(null)}
          onSuccess={() => setSelectedBillForPayment(null)}
        />
      )}
    </div>
  );
};
