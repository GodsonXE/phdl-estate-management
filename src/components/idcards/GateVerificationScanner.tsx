import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { IDCard } from '../../types';
import { QrCode, Search, ShieldCheck, ShieldAlert, CheckCircle, XCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { IDCardBadge } from './IDCardBadge';

export const GateVerificationScanner: React.FC = () => {
  const store = usePhdlStore();
  const idCards = store.getIDCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<IDCard | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'valid' | 'expired' | 'invalid'>('idle');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    const found = idCards.find(
      (c) =>
        c.cardNumber.toLowerCase().includes(query) ||
        c.holderName.toLowerCase().includes(query) ||
        c.flatCode.toLowerCase().includes(query) ||
        c.qrData.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedCard(found);
      const isExp = new Date(found.expiryDate || '2026-12-31') < new Date('2026-08-14');
      setScanStatus(isExp ? 'expired' : 'valid');
    } else {
      setSelectedCard(null);
      setScanStatus('invalid');
    }
  };

  const handleSimulateQuickScan = (card: IDCard) => {
    setSelectedCard(card);
    setSearchQuery(card.cardNumber);
    const isExp = new Date(card.expiryDate || '2026-12-31') < new Date('2026-08-14');
    setScanStatus(isExp ? 'expired' : 'valid');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #062215 0%, #0F402B 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-military">MAIN GATE DEFENCE POST</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-300)' }}>Military Police & Security Marshals</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800 }}>Estate Security Gate Checkpoint Scanner</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem' }}>
              Scan QR codes on physical or digital ID cards to verify residents, civilian tenants, dependents, and authorized staff.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={24} color="#062215" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Scanner / Search Control */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Search size={18} />
              Gate Pass Verification Scanner
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Scan QR Code or Input Card / Unit Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. PHDL-UNT-T-2025-019, Chukwudi, L1H1B..."
                  className="form-control"
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Search size={16} />
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Quick Simulation Presets */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Quick Presets for Live Testing:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {idCards.slice(0, 4).map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSimulateQuickScan(card)}
                  className="btn btn-outline btn-sm"
                  style={{ justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                >
                  <span style={{ fontWeight: 600 }}>{card.holderName}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--primary-700)' }}>
                    {card.cardNumber} ({card.flatCode})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Verdict Display */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} />
              Checkpoint Access Verdict
            </div>
          </div>

          {scanStatus === 'idle' && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
              <QrCode size={48} style={{ opacity: 0.25, margin: '0 auto 1rem' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Awaiting Scan or Card Input</div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Use a barcode/QR reader or enter resident identifier above to verify gate clearance.
              </p>
            </div>
          )}

          {scanStatus === 'valid' && selectedCard && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  border: '2px solid var(--status-success-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle size={32} color="#15803D" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--status-success-text)' }}>
                    ACCESS GRANTED • CLEAR TO ENTER
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#166534' }}>
                    Active & verified resident for {selectedCard.laneName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', backgroundColor: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>Resident Name:</span>
                  <div style={{ fontWeight: 700 }}>{selectedCard.holderName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>Unit / Flat:</span>
                  <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>{selectedCard.flatCode}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>Role / Rank:</span>
                  <div style={{ fontWeight: 600 }}>{selectedCard.holderRoleOrRank}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>ID Card Expiry:</span>
                  <div style={{ fontWeight: 700, color: '#15803D' }}>{formatDate(selectedCard.expiryDate || '2026-12-31')}</div>
                </div>
              </div>

              <IDCardBadge card={selectedCard} showPrintButton={false} />
            </div>
          )}

          {scanStatus === 'expired' && selectedCard && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--status-danger-bg)',
                  border: '2px solid var(--status-danger-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <XCircle size={32} color="#DC2626" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--status-danger-text)' }}>
                    ACCESS FLAGGED • ID EXPIRED
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#991B1B' }}>
                    Expired on {formatDate(selectedCard.expiryDate || '2026-12-31')}. Direct resident to PHDL Admin office.
                  </div>
                </div>
              </div>
            </div>
          )}

          {scanStatus === 'invalid' && (
            <div
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                border: '2px solid var(--status-danger-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <ShieldAlert size={40} color="#DC2626" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--status-danger-text)' }}>
                UNKNOWN / UNREGISTERED ENTRY
              </div>
              <p style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '0.35rem' }}>
                No active ID card or tenancy was found matching "{searchQuery}". Hold visitor for standard military gate verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
