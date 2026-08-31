import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { IdCard, ShieldCheck } from 'lucide-react';
import { IDCardBadge } from '../../components/idcards/IDCardBadge';

export const SoldierIDCardPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeSoldierId = store.getActiveSoldierId();
  const soldier = store.getSoldierById(activeSoldierId) || store.getSoldiers()[0];
  const idCards = store.getIDCards(currentEstateId);

  const myCard = idCards.find((c) => c.holderId === soldier.id) || idCards[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-military">ARMED FORCES RESIDENCE CLEARANCE</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Digital Gate Pass & Verification Badge
          </span>
        </div>
        <h2>My Official Smart Estate ID Card</h2>
        <p style={{ fontSize: '0.875rem' }}>
          Your digital estate badge for frictionless access through PHDL military security checkpoints and gates.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        {myCard ? (
          <IDCardBadge card={myCard} showPrintButton={true} />
        ) : (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <IdCard size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>ID Card Under Processing</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Your smart estate ID card is being provisioned by PHDL security command.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
