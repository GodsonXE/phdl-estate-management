import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { IdCard } from 'lucide-react';
import { IDCardBadge } from '../../components/idcards/IDCardBadge';

export const TenantIDCardPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeTenantId = store.getActiveTenantId();
  const tenant = store.getTenantById(activeTenantId) || store.getTenants()[0];
  const tenantFlat = tenant ? store.getFlatById(tenant.flatId) : undefined;
  const idCards = store.getIDCards(currentEstateId);

  // Cards for tenant & household dependents
  const myCards = idCards.filter((c) => c.holderId === tenant.id || (tenantFlat && c.flatCode === tenantFlat.fullFlatCode));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-info">SECURITY GATE PASS</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Digital QR Checkpoint Clearance
          </span>
        </div>
        <h2>Household Smart Estate ID & Gate Passes</h2>
        <p style={{ fontSize: '0.875rem' }}>
          Present this digital QR badge at the estate security checkpoint for gate marshal scanning.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '1rem' }}>
        {myCards.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <IdCard size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>Gate Pass Under Issuance</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Your digital gate pass ID is being processed by PHDL Security.
            </p>
          </div>
        ) : (
          myCards.map((card) => (
            <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                {card.holderName} ({card.holderRoleOrRank})
              </div>
              <IDCardBadge card={card} showPrintButton={true} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
