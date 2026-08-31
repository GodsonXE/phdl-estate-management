import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Bill } from '../../types';
import { usePhdlStore } from '../../data/storage';
import { formatNaira, formatDate } from '../../utils/formatters';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  X,
  Printer,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
} from 'lucide-react';

interface PaymentModalProps {
  bill?: Bill;
  customAmount?: number;
  customTitle?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bill,
  customAmount,
  customTitle,
  onClose,
  onSuccess,
}) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const serviceConfig = store.getServiceChargeConfig();
  const currentRole = store.getActiveRole();
  const activeSoldier = store.getSoldierById(store.getActiveSoldierId());
  const activeTenant = store.getTenantById(store.getActiveTenantId());

  // Bulk Tier Selector if Service Charge
  const isServiceCharge = bill?.billType === 'service_charge' || (customTitle && customTitle.toLowerCase().includes('service charge'));
  const [selectedBulkPeriod, setSelectedBulkPeriod] = useState<3 | 6 | 12>(
    customAmount === serviceConfig.sixMonthsAmount ? 6 : customAmount === serviceConfig.annualAmount ? 12 : 3
  );

  const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    reference: string;
    amountPaid: number;
    paymentDate: string;
    payerName: string;
    itemTitle: string;
  } | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('5399 4100 8821 9042');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('482');

  const payerName =
    currentRole === 'soldier'
      ? `${activeSoldier?.rank} ${activeSoldier?.fullName}`
      : currentRole === 'tenant'
      ? activeTenant?.fullName || 'Resident Tenant'
      : 'Estate Officer';

  const payerId = currentRole === 'soldier' ? activeSoldier?.id || 'soldier-1' : activeTenant?.id || 'tenant-1';

  // Amount calculation
  let amountToPay = 0;
  let titleToPay = bill?.title || customTitle || 'Estate Service Charge';

  if (isServiceCharge && !bill) {
    amountToPay =
      selectedBulkPeriod === 3
        ? (serviceConfig.threeMonthsAmount || serviceConfig.activeBulkCharges?.threeMonths || 30000)
        : selectedBulkPeriod === 6
        ? (serviceConfig.sixMonthsAmount || serviceConfig.activeBulkCharges?.sixMonths || 60000)
        : (serviceConfig.annualAmount || serviceConfig.activeBulkCharges?.annual || 120000);
    titleToPay = `Estate Service Charge (${selectedBulkPeriod} Months Bulk Payment)`;
  } else if (bill) {
    const ownerPortion = bill.ownerPortion || 0;
    const tenantPortion = bill.tenantPortion || 0;
    const ownerPaid = bill.ownerPaidAmount || 0;
    const tenantPaid = bill.tenantPaidAmount || 0;
    const totAmount = bill.totalAmount || bill.amount || 0;

    if (currentRole === 'soldier') {
      amountToPay = ownerPortion > 0 ? Math.max(0, ownerPortion - ownerPaid) : Math.max(0, totAmount - ownerPaid);
    } else if (currentRole === 'tenant') {
      amountToPay = tenantPortion > 0 ? Math.max(0, tenantPortion - tenantPaid) : Math.max(0, totAmount - tenantPaid);
    } else {
      amountToPay = totAmount;
    }
  } else if (customAmount) {
    amountToPay = customAmount;
  }

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ref = (gateway === 'paystack' ? 'PST_' : 'FLW_') + Math.floor(100000000000 + Math.random() * 900000000000);
      const recNumber = `REC-PHDL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toISOString();

      store.recordPayment({
        id: `pay-${Date.now()}`,
        billId: bill?.id,
        paymentType: bill?.billType === 'power_electricity' ? 'utility_bill' : 'service_charge',
        flatId: bill?.flatId || activeTenant?.flatId || 'flat-1',
        estateId: bill?.estateId || currentEstateId,
        payerId,
        payerRole: currentRole,
        payerName,
        amountPaid: amountToPay,
        paymentDate: nowStr,
        paymentMethod: gateway,
        transactionReference: ref,
        receiptNumber: recNumber,
        status: 'success',
        notes: `Paid online via ${gateway.toUpperCase()} (${paymentMethod === 'card' ? 'Debit Card' : 'Bank Transfer'}) - ${titleToPay}`,
      });

      setReceiptData({
        receiptNumber: recNumber,
        reference: ref,
        amountPaid: amountToPay,
        paymentDate: nowStr,
        payerName,
        itemTitle: titleToPay,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error', err);
      }

      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
              <img src="/phdl-logo.png" alt="PHDL Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                {receiptData ? 'Official Electronic Payment Receipt' : 'PHDL Treasury Payment Terminal'}
              </h3>
              <div style={{ fontSize: '0.7rem', color: 'var(--army-gold-300)', fontWeight: 700 }}>
                RC 676563 • 256-Bit Encrypted Military Treasury Clearance
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close dialog" style={{ color: '#FFFFFF' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {receiptData ? (
            /* Official Receipt View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                className="printable-area"
                style={{
                  border: '2px dashed var(--army-green-800)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                }}
              >
                {/* Header with official logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderBottom: '1.5px solid var(--army-green-800)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                  <img src="/phdl-logo.png" alt="PHDL Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: 'var(--army-red-700)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                      PHDL Estates
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--army-green-950)', fontWeight: 700 }}>
                      RC 676563 • Official Treasury Revenue Receipt
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                  <div style={{ backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--status-success-border)' }}>
                    <CheckCircle2 size={15} />
                    PAYMENT CLEARED & ACKNOWLEDGED
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '0.85rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Total Settled</div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                    {formatNaira(receiptData.amountPaid)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.8rem', backgroundColor: 'var(--army-green-50)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Receipt No:</span>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--army-green-950)' }}>{receiptData.receiptNumber}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Gateway Ref:</span>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{receiptData.reference}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Payer Name:</span>
                    <div style={{ fontWeight: 700 }}>{receiptData.payerName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Date & Time:</span>
                    <div style={{ fontWeight: 700 }}>{formatDate(receiptData.paymentDate)}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Payment Purpose:</span>
                    <div style={{ fontWeight: 800, color: 'var(--army-green-900)' }}>{receiptData.itemTitle}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }} className="no-print">
                <button onClick={handlePrintReceipt} className="btn btn-outline" style={{ gap: '0.4rem' }}>
                  <Printer size={16} />
                  Print Official Receipt
                </button>
                <button onClick={onClose} className="btn btn-primary" style={{ backgroundColor: 'var(--army-green-800)' }}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Checkout & Gateway Form */
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* If Service Charge, show Bulk Tier Selection */}
              {isServiceCharge && !bill && (
                <div style={{ backgroundColor: 'var(--army-green-50)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1.5px solid var(--army-green-300)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--army-green-950)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Select Bulk Service Charge Tier (₦{(serviceConfig.standardMonthlyRate || serviceConfig.monthlyRate || 10000).toLocaleString()}/mo)
                    </span>
                    <span className="badge badge-military" style={{ fontSize: '0.625rem' }}>Direct Estate Tariff</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedBulkPeriod(3)}
                      className={`btn btn-sm ${selectedBulkPeriod === 3 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.5rem 0.3rem', backgroundColor: selectedBulkPeriod === 3 ? 'var(--army-green-800)' : '#FFFFFF' }}
                    >
                      <strong style={{ fontSize: '0.75rem' }}>3 Months</strong>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{formatNaira(serviceConfig.threeMonthsAmount || serviceConfig.activeBulkCharges?.threeMonths || 30000)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBulkPeriod(6)}
                      className={`btn btn-sm ${selectedBulkPeriod === 6 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.5rem 0.3rem', backgroundColor: selectedBulkPeriod === 6 ? 'var(--army-green-800)' : '#FFFFFF' }}
                    >
                      <strong style={{ fontSize: '0.75rem' }}>6 Months</strong>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{formatNaira(serviceConfig.sixMonthsAmount || serviceConfig.activeBulkCharges?.sixMonths || 60000)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBulkPeriod(12)}
                      className={`btn btn-sm ${selectedBulkPeriod === 12 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.5rem 0.3rem', backgroundColor: selectedBulkPeriod === 12 ? 'var(--army-green-800)' : '#FFFFFF' }}
                    >
                      <strong style={{ fontSize: '0.75rem' }}>12 Months</strong>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{formatNaira(serviceConfig.annualAmount || serviceConfig.activeBulkCharges?.annual || 120000)}</span>
                    </button>
                  </div>

                  {/* SuperAdmin Remarks Note */}
                  <div style={{ marginTop: '0.75rem', fontSize: '0.725rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', gap: '0.35rem', alignItems: 'flex-start' }}>
                    <Info size={13} color="var(--army-gold-700)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>"{serviceConfig.remarks}"</span>
                  </div>
                </div>
              )}

              {/* Bill Details Summary Card */}
              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Payment Particulars
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--army-green-950)', marginTop: '0.2rem' }}>
                  {titleToPay}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>Payer Persona:</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{payerName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>Total Payable</span>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--army-green-800)' }}>
                      {formatNaira(amountToPay)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gateway Switcher */}
              <div>
                <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                  Choose Processing Gateway
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setGateway('paystack')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: gateway === 'paystack' ? '2px solid #00C3F7' : '1px solid var(--border-subtle)',
                      backgroundColor: gateway === 'paystack' ? '#F0FBFF' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      color: '#002B36',
                    }}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: gateway === 'paystack' ? '#00C3F7' : '#CCC' }} />
                    Paystack
                  </button>

                  <button
                    type="button"
                    onClick={() => setGateway('flutterwave')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: gateway === 'flutterwave' ? '2px solid #F5A623' : '1px solid var(--border-subtle)',
                      backgroundColor: gateway === 'flutterwave' ? '#FFFBF0' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      color: '#331B00',
                    }}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: gateway === 'flutterwave' ? '#F5A623' : '#CCC' }} />
                    Flutterwave
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#FAF9F6' }}>
                <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="form-control"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="form-control"
                      style={{ fontFamily: 'var(--font-mono)' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="form-control"
                      maxLength={4}
                      style={{ fontFamily: 'var(--font-mono)' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary"
                  style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)', minWidth: 160 }}
                >
                  <CreditCard size={15} />
                  {isProcessing ? 'Authorizing...' : `Pay ${formatNaira(amountToPay)}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
