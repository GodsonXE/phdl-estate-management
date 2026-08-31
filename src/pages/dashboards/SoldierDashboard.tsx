import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  Home,
  Users,
  CreditCard,
  IdCard,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Receipt,
  PlusCircle,
  Wrench,
  Shield,
} from 'lucide-react';
import { formatNaira, formatDate, getStatusBadgeClass, getStatusLabel, getRentCycleDetails } from '../../utils/formatters';
import { ActivePage } from '../../components/layout/Sidebar';
import { PaymentModal } from '../../components/billing/PaymentModal';

interface SoldierDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const SoldierDashboard: React.FC<SoldierDashboardProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const activeSoldierId = store.getActiveSoldierId();
  const soldier = store.getSoldierById(activeSoldierId) || store.getSoldiers()[0];
  const allFlats = store.getFlats(currentEstateId);
  const tenants = store.getTenants(currentEstateId);
  const leases = store.getLeases();
  const bills = store.getBills(currentEstateId);
  const idCards = store.getIDCards(currentEstateId);
  const maintenance = store.getMaintenanceRequests(currentEstateId);

  const [payingBill, setPayingBill] = useState<any | null>(null);

  // Owned flats
  const myFlats = allFlats.filter((f) => soldier.ownedFlatIds.includes(f.id));
  const myTenantIds = myFlats.map((f) => f.currentTenantId).filter(Boolean);
  const myTenants = tenants.filter((t) => myTenantIds.includes(t.id));

  // Bills assigned to soldier
  const myBills = bills.filter(
    (b) => myFlats.some((f) => f.id === b.flatId) && (b.payerRole === 'owner' || b.payerRole === 'split')
  );
  const unpaidBills = myBills.filter((b) => b.status === 'unpaid' || b.status === 'overdue');
  const myIdCard = idCards.find((c) => c.holderId === soldier.id);
  const myTickets = maintenance.filter((m) => myFlats.some((f) => f.id === m.flatId) || m.raisedById === soldier.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Officer Header Profile Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--army-green-950) 0%, var(--army-green-900) 65%, var(--army-green-800) 100%)',
          color: '#FFFFFF',
          padding: '1.75rem',
          border: '2px solid var(--army-gold-500)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Watermark Logo */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            opacity: 0.1,
            pointerEvents: 'none',
            width: 220,
            height: 220,
          }}
        >
          <img src="/phdl-logo.png" alt="watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 'var(--radius-md)',
                border: '2.5px solid var(--army-gold-400)',
                overflow: 'hidden',
                backgroundColor: '#072B1C',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {soldier.avatarUrl ? (
                <img src={soldier.avatarUrl} alt={soldier.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--army-gold-300)', fontWeight: 800, fontSize: '1.25rem' }}>
                  {soldier.rank.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge" style={{ backgroundColor: 'var(--army-red-600)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.7rem' }}>
                  {soldier.militaryBranch.toUpperCase()}
                </span>
                <span className="badge badge-success" style={{ backgroundColor: 'var(--army-green-600)', color: '#FFFFFF', fontWeight: 700 }}>
                  ✓ VERIFIED DEED TITLE
                </span>
              </div>
              <h1 style={{ color: '#FFFFFF', fontSize: '1.55rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {soldier.rank} {soldier.fullName}
              </h1>
              <div style={{ fontSize: '0.8rem', color: 'var(--army-gold-300)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem', fontWeight: 700 }}>
                Service No: {soldier.serviceNumber} • {soldier.unitBrigade}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('soldier_properties')} className="btn btn-accent" style={{ gap: '0.4rem', backgroundColor: 'var(--army-gold-500)', color: '#072B1C', fontWeight: 800 }}>
              <Home size={16} />
              Manage Subletting ({myFlats.length} Flats)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card" onClick={() => onNavigate('soldier_properties')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Owned Properties</div>
            <div className="stat-value" style={{ color: 'var(--army-green-950)' }}>{myFlats.length}</div>
            <div className="stat-subtext">
              {myFlats.map((f) => f.fullFlatCode).join(', ')}
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Home size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('soldier_tenants')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Active Tenants</div>
            <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>{myTenants.length}</div>
            <div className="stat-subtext">Annual lease registered</div>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('soldier_billing')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">My Pending Bills</div>
            <div className="stat-value" style={{ color: unpaidBills.length > 0 ? 'var(--army-red-700)' : 'var(--army-green-800)' }}>
              {unpaidBills.length} Due
            </div>
            <div className="stat-subtext">
              {unpaidBills.length > 0 ? 'Service charge / Levies' : 'All levies settled'}
            </div>
          </div>
          <div className="stat-icon-wrapper stat-icon-wrapper-red">
            <Receipt size={22} />
          </div>
        </div>
      </div>

      {/* Flats Overview & Subletting Controls */}
      <div className="card card-army-accent">
        <div className="card-header">
          <div className="card-title">
            <Home size={18} color="var(--army-green-800)" />
            My Housing Units & Tenancy Status
          </div>
          <button onClick={() => onNavigate('soldier_properties')} className="btn btn-outline btn-sm">
            Configure Listings
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {myFlats.map((flat) => {
            const tenant = tenants.find((t) => t.id === flat.currentTenantId);
            const flatLease = leases.find((l) => l.flatId === flat.id && l.status === 'active');
            const rentCycle = tenant ? getRentCycleDetails(tenant.leaseStart, tenant.leaseEnd) : null;

            return (
              <div
                key={flat.id}
                style={{
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  backgroundColor: flat.status === 'sublet' ? 'var(--army-green-50)' : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => onNavigate('soldier_properties')}
                  title="Click to manage property listing"
                >
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--army-green-950)' }}>
                      Flat {flat.fullFlatCode}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {flat.floor} • 2-Bedroom Flat
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(flat.status)}`}>
                    {getStatusLabel(flat.status)}
                  </span>
                </div>

                {flat.status === 'sublet' && tenant ? (
                  <div
                    onClick={() => onNavigate('soldier_tenants')}
                    style={{ backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)', fontSize: '0.8rem', cursor: 'pointer' }}
                    title="Click to view tenant details"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--army-green-800)', fontWeight: 800, textTransform: 'uppercase' }}>
                        Civilian Tenant Information
                      </span>
                      {rentCycle && (
                        <span className={`badge ${rentCycle.badgeClass}`} style={{ fontSize: '0.65rem' }}>
                          {rentCycle.badgeLabel}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--army-green-950)', marginTop: '0.25rem' }}>
                      {tenant.fullName} →
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>{tenant.occupation} ({tenant.phone})</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--army-green-200)' }}>
                      <span>Annual Rent Paid:</span>
                      <strong style={{ color: 'var(--army-green-800)' }}>{formatNaira(tenant.rentAmount || tenant.annualRentAmount || 1200000)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                      <span>Tenancy Cycle:</span>
                      <span>{formatDate(tenant.leaseStart || tenant.rentStartDate || '2026-01-01')} – {formatDate(tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31')}</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => onNavigate('soldier_properties')}
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', cursor: 'pointer' }}
                    title="Click to enable subletting"
                  >
                    <div style={{ color: 'var(--text-subtle)' }}>
                      Occupied by Officer & Family. Click to configure subletting options.
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  <span>Meter: <strong style={{ fontFamily: 'var(--font-mono)' }}>{flat.meterNumber}</strong></span>
                  <span>{flat.isAvailableForSublet ? 'Open for Rent' : 'Owner Occupied'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Landlord Invoices & Action */}
      {unpaidBills.length > 0 && (
        <div className="card card-red-accent">
          <div className="card-header">
            <div className="card-title" style={{ color: 'var(--army-red-700)' }}>
              <AlertTriangle size={18} />
              Pending Owner Levies ({unpaidBills.length})
            </div>
            <button onClick={() => onNavigate('soldier_billing')} className="btn btn-outline-red btn-sm">
              View Billing Center
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {unpaidBills.map((bill) => (
              <div
                key={bill.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem',
                  backgroundColor: 'var(--army-red-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--army-red-200)',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--army-red-950)' }}>{bill.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Invoice: {bill.invoiceNumber || bill.id} • Due: {formatDate(bill.dueDate)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Your Share</div>
                    <strong style={{ fontSize: '1rem', color: 'var(--army-red-800)' }}>
                      {formatNaira((bill.ownerPortion && bill.ownerPortion > 0) ? bill.ownerPortion : (bill.totalAmount || bill.amount || 0))}
                    </strong>
                  </div>

                  <button
                    onClick={() => setPayingBill(bill)}
                    className="btn btn-accent btn-sm"
                    style={{ gap: '0.35rem', backgroundColor: 'var(--army-gold-500)', color: '#072B1C', fontWeight: 800 }}
                  >
                    <CreditCard size={14} />
                    Pay via Paystack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
