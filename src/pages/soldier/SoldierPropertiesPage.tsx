import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Flat } from '../../types';
import { Home, ToggleLeft, ToggleRight, DollarSign, Edit3, CheckCircle2, UserPlus } from 'lucide-react';
import { formatNaira, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';

interface SoldierPropertiesPageProps {
  onAddTenantClick?: (flat: Flat) => void;
}

export const SoldierPropertiesPage: React.FC<SoldierPropertiesPageProps> = ({ onAddTenantClick }) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const activeSoldierId = store.getActiveSoldierId();
  const soldier = store.getSoldierById(activeSoldierId) || store.getSoldiers()[0];
  const allFlats = store.getFlats(currentEstateId);
  const tenants = store.getTenants(currentEstateId);

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const myFlats = allFlats.filter((f) => soldier.ownedFlatIds.includes(f.id));

  const handleToggleSublet = (flat: Flat) => {
    const updated: Flat = {
      ...flat,
      isAvailableForSublet: !flat.isAvailableForSublet,
      subletAskingRent: flat.subletAskingRent || 1800000,
    };
    store.updateFlat(updated);
    store.logAudit({
      estateId: currentEstateId,
      actorId: soldier.id,
      actorName: soldier.fullName,
      actorRole: 'soldier',
      action: 'SUBLET_LISTING_TOGGLED',
      entityAffected: 'Flat',
      entityId: flat.id,
      details: `${soldier.rank} ${soldier.fullName} marked Flat ${flat.fullFlatCode} as ${updated.isAvailableForSublet ? 'Available for Subletting (₦1.8M/yr)' : 'Private/Unlisted'}.`,
    });

    setNoticeMessage(`Flat ${flat.fullFlatCode} listing status updated.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-military">OFFICER ASSET PORTFOLIO</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            {soldier.rank} {soldier.fullName} ({soldier.serviceNumber})
          </span>
        </div>
        <h2>My Housing Units & Subletting Controls</h2>
        <p style={{ fontSize: '0.875rem' }}>
          Toggle civilian subletting availability for your allocated military flats, specify asking rent, and review tenancy contracts.
        </p>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {myFlats.map((flat) => {
          const tenant = tenants.find((t) => t.id === flat.currentTenantId);

          return (
            <div key={flat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="card-header">
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-900)' }}>
                      Flat {flat.fullFlatCode}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {flat.floor} • {flat.flatType.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(flat.status)}`}>
                    {getStatusLabel(flat.status)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.725rem' }}>Electricity Meter:</span>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{flat.meterNumber}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-subtle)', fontSize: '0.725rem' }}>Water Connection:</span>
                      <div style={{ fontWeight: 600, color: '#15803D' }}>Central Scheme</div>
                    </div>
                  </div>

                  {/* Subletting Status Box */}
                  <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Subletting Status</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                          {flat.isAvailableForSublet ? 'Listed on PHDL Civilian Subletting Board' : 'Private / Unlisted'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleSublet(flat)}
                        className={`btn btn-sm ${flat.isAvailableForSublet ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {flat.isAvailableForSublet ? 'Listed (Open)' : 'Disabled'}
                      </button>
                    </div>

                    {flat.isAvailableForSublet && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Target Asking Rent:</span>
                        <strong style={{ color: 'var(--primary-800)' }}>
                          {formatNaira(flat.subletAskingRent || 1800000)} / year
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Current Tenant Info */}
                  {flat.status === 'sublet' && tenant ? (
                    <div style={{ padding: '0.85rem', backgroundColor: '#F0F9FF', borderRadius: 'var(--radius-md)', border: '1px solid #BAE6FD' }}>
                      <div style={{ fontSize: '0.7rem', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase' }}>
                        Active Tenancy
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0C4A6E', marginTop: '0.2rem' }}>
                        {tenant.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {tenant.occupation} • {tenant.phone}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      No active civilian tenant in this unit.
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
                {flat.status !== 'sublet' && (
                  <button
                    onClick={() => onAddTenantClick && onAddTenantClick(flat)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', gap: '0.35rem' }}
                  >
                    <UserPlus size={14} />
                    Onboard New Tenant
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
