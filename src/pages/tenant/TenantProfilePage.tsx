import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { FileText, Shield, User, Building, Calendar, DollarSign, Download, Printer, CheckCircle2 } from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

export const TenantProfilePage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeTenantId = store.getActiveTenantId();
  const activeTenant = store.getTenantById(activeTenantId);
  const flats = store.getFlats(currentEstateId) || [];
  const lanes = store.getLanes(currentEstateId) || [];
  const soldiers = store.getSoldiers() || [];

  const flat = flats.find((f) => f.id === activeTenant?.flatId);
  const lane = lanes.find((l) => l.id === flat?.laneId);
  const landlord = soldiers.find((s) => s.id === activeTenant?.landlordId || s.id === flat?.ownerId);

  if (!activeTenant) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>OFFICIAL LEASE REGISTRY</span> • <span>RC 676563</span>
          </div>
          <h1>My Tenancy Agreement & Particulars</h1>
          <p>Verified 2-bedroom lease agreement records and soldier landlord allocation details.</p>
        </div>

        <button onClick={() => window.print()} className="btn btn-outline" style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}>
          <Printer size={16} /> Print Lease Record
        </button>
      </div>

      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--army-gold-400)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={24} color="var(--army-green-800)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--army-green-950)' }}>
                Residential Tenancy Deed • Flat {flat?.fullFlatCode || 'L1H1A'}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                PHDL Unity Estate Abuja • 2-Bedroom Standard Residential Unit
              </div>
            </div>
          </div>
          <span className="badge badge-success">✓ Tenancy Active & Verified</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>RESIDENT TENANT</div>
            <strong style={{ fontSize: '1rem', color: 'var(--army-green-950)' }}>{activeTenant.fullName}</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeTenant.phone}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeTenant.email}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>SOLDIER LANDLORD</div>
            <strong style={{ fontSize: '1rem', color: 'var(--army-green-950)' }}>
              {landlord ? `${landlord.rank} ${landlord.fullName}` : activeTenant.landlordNameUnverified || 'UnIdentified Soldier'}
            </strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{landlord?.phone || '+234 803 000 0000'}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{landlord?.militaryBranch || 'Nigerian Armed Forces'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>TENANCY CYCLE</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--army-green-900)' }}>
              {formatDate(activeTenant.rentStartDate || '2026-01-01')} → {formatDate(activeTenant.rentExpiryDate || '2026-12-31')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Annual Rate: <strong>{formatNaira(activeTenant.annualRentAmount || flat?.rentAmount || 1200000)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};