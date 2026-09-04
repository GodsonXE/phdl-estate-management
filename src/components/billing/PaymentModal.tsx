import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Shield, X, Download, Printer } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  invoiceId?: string;
  onSuccess?: (receiptNo: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  invoiceId = 'INV-2026-001',
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [gateway, setGateway] = useState<'paystack' | 'flutterwave' | 'remita'>('paystack');

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedReceipt = `RCP-PHDL-${Date.now().toString().slice(-6)}`;
      setReceiptNo(generatedReceipt);
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess(generatedReceipt);
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3 style={{ margin: 0, color: '#FFFFFF' }}>
            {isSuccess ? 'Payment Successful' : 'Estate Levy Checkout'}
          </h3>
          <button onClick={handleClose} className="btn btn-outline btn-sm">✕</button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handlePay} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 8 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>PAYMENT SUMMARY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--army-green-950)', marginTop: 4 }}>
                ₦{amount.toLocaleString()}.00
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: 4 }}>{description}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                Ref: {invoiceId}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Select Payment Channel:</label>
              <select value={gateway} onChange={(e) => setGateway(e.target.value as any)} className="form-select">
                <option value="paystack">Paystack (Debit Card / USSD / Bank Transfer)</option>
                <option value="flutterwave">Flutterwave (Cards & Mobile Money)</option>
                <option value="remita">Remita (Direct Bank / TSA)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#15803D' }}>
              <Shield size={14} /> 256-Bit SSL Secured Military Housing Gateway
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={handleClose} className="btn btn-outline">Cancel</button>
              <button type="submit" disabled={isProcessing} className="btn btn-primary" style={{ backgroundColor: '#15803D', gap: '0.4rem' }}>
                <CreditCard size={15} /> {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: '2rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} color="#15803D" />
            </div>

            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Payment Confirmed!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Your transaction has been approved and logged to the central revenue ledger.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem 1.25rem', borderRadius: 8, width: '100%', fontSize: '0.82rem', textAlign: 'left' }}>
              <div><strong>Receipt Number:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{receiptNo}</span></div>
              <div><strong>Amount Paid:</strong> ₦{amount.toLocaleString()}</div>
              <div><strong>Status:</strong> <span className="badge badge-success" style={{ marginLeft: 4 }}>Verified</span></div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-outline" style={{ flex: 1, gap: '0.4rem' }}>
                <Printer size={14} /> Print Receipt
              </button>
              <button onClick={handleClose} className="btn btn-primary" style={{ flex: 1, backgroundColor: '#1B4D21' }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;