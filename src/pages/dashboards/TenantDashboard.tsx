import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { ActivePage } from '../../components/layout/Sidebar';
import {
  FileText,
  CreditCard,
  IdCard,
  Users,
  Shield,
  Phone,
  Mail,
  UserCheck,
  AlertCircle,
  Building,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { TenantProfileCompletionModal } from '../../components/onboarding/TenantProfileCompletionModal';
import { formatNaira, formatDate } from '../../utils/formatters';

interface TenantDashboardProps {
  onNavigate: (page: ActivePage) => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({ onNavigate }) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeTenantId = store.getActiveTenantId();
  const tenants = store.getTenants() || [];
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const flats = store.getFlats(currentEstateId) || [];
  const lanes = store.getLanes(currentEstateId) || [];
  const soldiers = store.getSoldiers() || [];
  const bills = store.getBills(currentEstateId) || [];

  const flat = flats.find((f) => f.id === activeTenant?.flatId);
  const lane = lanes.find((l) => l.id === flat?.laneId);
  const soldierLandlord = soldiers.find((s) => s.id === activeTenant?.landlordId || s.id === flat?.ownerId);

  // Filter bills for this tenant
  const tenantBills = bills.filter((b) => b.tenantId === activeTenant?.id || b.flatId === flat?.id);
  const unpaidBills = tenantBills.filter((b) => b.status === 'unpaid' || b.status === 'overdue');
  const totalUnpaidAmount = unpaidBills.reduce((acc, b) => acc + (b.totalAmount || b.amount || 0), 0);

  // Step 7 Profile Completion Modal Trigger
  const [showProfileModal, setShowProfileModal] = useState<boolean>(
    Boolean(activeTenant?.profileIncomplete)
  );

  // Landlord Details Modal
  const [showLandlordModal, setShowLandlordModal] = useState(false);

  if (!activeTenant) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <AlertCircle size={32} color="var(--army-red-700)" style={{ margin: '0 auto 1rem' }} />
        <h3>No Active Tenancy Record Found</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Please complete tenant onboarding to access your residence portal.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ========================================================= */}
      {/* STEP 6: CONDITIONAL LANDLORD RESOLUTION BANNER            */}
      {/* ========================================================= */}
      {soldierLandlord && soldierLandlord.id !== 'soldier-unidentified' ? (
        // Landlord is Resolved / Verified Soldier
        <div
          style={{
            padding: '0.9rem 1.25rem',
            backgroundColor: 'var(--army-green-50)',
            border: '1.5px solid var(--army-green-700)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: 'var(--army-green-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--army-green-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                VERIFIED ARMED FORCES LANDLORD
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
                Hi <strong>{activeTenant.fullName}</strong>, your landlord is{' '}
                <strong>
                  {soldierLandlord.rank} {soldierLandlord.fullName}
                </strong>{' '}
                ({soldierLandlord.militaryBranch}).
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLandlordModal(true)}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.3rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)', fontWeight: 700 }}
          >
            <UserCheck size={14} />
            View Landlord Information
          </button>
        </div>
      ) : (
        // Landlord is Unknown / Unverified Free Text
        <div
          style={{
            padding: '0.9rem 1.25rem',
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #F59E0B',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={24} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                LANDLORD REGISTRATION PENDING
              </div>
              <div style={{ fontSize: '0.85rem', color: '#78350F' }}>
                {activeTenant.landlordNameUnverified
                  ? `You registered your landlord as "${activeTenant.landlordNameUnverified}". PHDL is reconciling the official title.`
                  : "We don't have your landlord's official information on file yet. You can add it below."}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tenant_profile')}
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#D97706', color: '#92400E', fontWeight: 700 }}
          >
            Update Tenancy Details
          </button>
        </div>
      )}

      {/* Main Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>RESIDENT PORTAL</span> • <span>FLAT {flat?.fullFlatCode || 'L1H1A'} ({lane?.name || 'Lane 1'})</span>
          </div>
          <h1>Welcome, {activeTenant.fullName}</h1>
          <p>
            Manage your 2-bedroom tenancy, service charge levies (₦10k/month in 3, 6, or 12-month bundles), and digital smart gate pass.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('tenant_id_card')}
            className="btn btn-outline"
            style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}
          >
            <IdCard size={16} />
            Digital Gate Pass
          </button>
          <button
            onClick={() => onNavigate('tenant_billing')}
            className="btn btn-primary"
            style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
          >
            <CreditCard size={16} />
            Pay Levies & Rent
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stat-grid">
        <div
          className="stat-card"
          onClick={() => onNavigate('tenant_profile')}
          style={{ cursor: 'pointer' }}
          title="Click to view full residence profile"
        >
          <div>
            <div className="stat-label">Assigned Residence</div>
            <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>
              Flat {flat?.fullFlatCode || 'L1H1A'}
            </div>
            <div className="stat-subtext">{lane?.name || 'Lane 1'} • 2-Bedroom Suite →</div>
          </div>
          <div className="stat-icon-wrapper">
            <Building size={22} />
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => onNavigate('tenant_profile')}
          style={{ cursor: 'pointer' }}
          title="Click to view tenancy agreement"
        >
          <div>
            <div className="stat-label">Tenancy Cycle Expiry</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {formatDate(activeTenant.rentExpiryDate || '2026-12-31')}
            </div>
            <div className="stat-subtext">
              Rent: {formatNaira(activeTenant.annualRentAmount || 1200000)} / year →
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <Calendar size={22} />
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => onNavigate('tenant_billing')}
          style={{ cursor: 'pointer' }}
          title="Click to view billing and pay levies"
        >
          <div>
            <div className="stat-label">Outstanding Bills / Levies</div>
            <div className="stat-value" style={{ color: totalUnpaidAmount > 0 ? 'var(--army-red-700)' : 'var(--status-success-text)' }}>
              {formatNaira(totalUnpaidAmount)}
            </div>
            <div className="stat-subtext">
              {unpaidBills.length === 0 ? '✓ Account in Good Standing' : `${unpaidBills.length} unpaid invoices →`}
            </div>
          </div>
          <div className="stat-icon-wrapper">
            <CreditCard size={22} />
          </div>
        </div>

        <div
          className="stat-card"
          onClick={() => onNavigate('tenant_dependents')}
          style={{ cursor: 'pointer' }}
          title="Click to manage household dependents"
        >
          <div>
            <div className="stat-label">Household Dependents</div>
            <div className="stat-value">
              {activeTenant.dependents?.length || activeTenant.dependentsCount || 0}
            </div>
            <div className="stat-subtext">Registered for Gate Clearance →</div>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s ease' }}
          onClick={() => onNavigate('tenant_billing')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="var(--army-green-800)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--army-green-950)' }}>Service Charge Levies</strong>
            </div>
            <ArrowRight size={16} color="var(--text-subtle)" />
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Pay the mandatory standard ₦10,000 monthly service charge in official bulk tiers (3, 6, or 12 months).
          </p>
        </div>

        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s ease' }}
          onClick={() => onNavigate('tenant_dependents')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--army-green-800)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--army-green-950)' }}>Household Dependents</strong>
            </div>
            <ArrowRight size={16} color="var(--text-subtle)" />
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Add family members and wards to authorize their individual digital smart gate passes.
          </p>
        </div>

        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', transition: 'all 0.15s ease' }}
          onClick={() => onNavigate('tenant_id_card')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IdCard size={18} color="var(--army-green-800)" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--army-green-950)' }}>Smart ID Pass</strong>
            </div>
            <ArrowRight size={16} color="var(--text-subtle)" />
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            View your official PHDL QR Gate Pass badge for security scanning at the main estate gate.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 7: DISMISSIBLE PROFILE COMPLETION MODAL              */}
      {/* ========================================================= */}
      {showProfileModal && (
        <TenantProfileCompletionModal
          tenant={activeTenant}
          onClose={() => setShowProfileModal(false)}
          onSaved={() => setShowProfileModal(false)}
        />
      )}

      {/* Landlord Detail Modal */}
      {showLandlordModal && soldierLandlord && (
        <div className="modal-backdrop" onClick={() => setShowLandlordModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} />
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Soldier Landlord Particulars</h3>
              </div>
              <button onClick={() => setShowLandlordModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Landlord Name & Rank</div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--army-green-950)' }}>
                  {soldierLandlord.rank} {soldierLandlord.fullName}
                </strong>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Armed Forces Formation</div>
                <div style={{ fontWeight: 600 }}>{soldierLandlord.militaryBranch} • {soldierLandlord.unitBrigade}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Service Number</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--army-green-800)' }}>
                  {soldierLandlord.serviceNumber}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Contact Phone & Email</div>
                <div>{soldierLandlord.phone}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{soldierLandlord.email}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowLandlordModal(false)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};