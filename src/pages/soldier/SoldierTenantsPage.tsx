import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Flat, Tenant, LeaseAgreement, Dependent } from '../../types';
import { Users, UserPlus, FileText, Phone, Mail, CheckCircle2, X, PlusCircle } from 'lucide-react';
import { formatNaira, formatDate, getStatusBadgeClass, getStatusLabel, getRentCycleDetails } from '../../utils/formatters';

export const SoldierTenantsPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const activeSoldierId = store.getActiveSoldierId();
  const soldier = store.getSoldierById(activeSoldierId) || store.getSoldiers()[0];
  const allFlats = store.getFlats(currentEstateId);
  const myFlats = allFlats.filter((f) => soldier.ownedFlatIds.includes(f.id));
  const tenants = store.getTenants(currentEstateId);
  const leases = store.getLeases();
  const dependents = store.getDependents();

  const myTenants = tenants.filter((t) => t.landlordId === soldier.id);

  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [selectedTenantForDep, setSelectedTenantForDep] = useState<Tenant | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Tenant Onboarding Form
  const [targetFlatId, setTargetFlatId] = useState(myFlats[0]?.id || 'flat-1');
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('+234 80');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantOccupation, setTenantOccupation] = useState('');
  const [tenantEmployer, setTenantEmployer] = useState('');
  const [rentAmount, setRentAmount] = useState<number>(1800000);
  const [leaseStart, setLeaseStart] = useState('2026-09-01');
  const [leaseEnd, setLeaseEnd] = useState('2027-08-31');
  const [nokName, setNokName] = useState('');
  const [nokPhone, setNokPhone] = useState('+234 80');
  const [nokRel, setNokRel] = useState('Spouse');

  // Dependent Form
  const [depName, setDepName] = useState('');
  const [depRel, setDepRel] = useState<Dependent['relationship']>('Spouse');
  const [depAge, setDepAge] = useState<number>(30);
  const [depGender, setDepGender] = useState<'Male' | 'Female'>('Female');

  const handleOnboardTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const tId = `tenant-${Date.now()}`;
    const flat = myFlats.find((f) => f.id === targetFlatId) || myFlats[0];

    const newTenant: Tenant = {
      id: tId,
      fullName: tenantName,
      phone: tenantPhone,
      email: tenantEmail,
      occupation: tenantOccupation,
      employer: tenantEmployer,
      flatId: flat.id,
      landlordId: soldier.id,
      estateId: currentEstateId,
      rentStartDate: leaseStart,
      rentExpiryDate: leaseEnd,
      leaseStart,
      leaseEnd,
      rentAmount,
      annualRentAmount: rentAmount,
      status: 'active',
      nextOfKinName: nokName,
      nextOfKinPhone: nokPhone,
      nextOfKinRelationship: nokRel,
      idCardNumber: `PHDL-UNT-T-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      dependentsCount: 0,
      dependents: [],
      createdAt: new Date().toISOString(),
    };

    store.addTenant(newTenant);
    setShowOnboardModal(false);
    setNoticeMessage(`Civilian tenant ${tenantName} successfully onboarded for Flat ${flat.fullFlatCode}.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForDep) return;

    const newDep: Dependent = {
      id: `dep-${Date.now()}`,
      linkedToId: selectedTenantForDep.id,
      fullName: depName,
      relationship: depRel,
      age: depAge,
      gender: depGender.toLowerCase() as 'male' | 'female',
    };

    store.addDependent(newDep, selectedTenantForDep.id);
    setShowAddDepModal(false);
    setDepName('');
    setNoticeMessage(`Dependent ${depName} registered under ${selectedTenantForDep.fullName}'s household.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-military">TENANCY MANAGEMENT</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {soldier.rank} {soldier.fullName}
            </span>
          </div>
          <h2>Tenant Onboarding, Contracts & Dependents</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Manage civilian lease agreements, rent payment records, and household dependent security registries.
          </p>
        </div>

        <button onClick={() => setShowOnboardModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <UserPlus size={16} />
          Onboard New Tenant
        </button>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      {/* Tenants List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {myTenants.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <Users size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>No Civilian Tenants Currently Onboarded</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              You have not registered any subletting tenants for your owned flats. Click "Onboard New Tenant" to add one.
            </p>
          </div>
        ) : (
          myTenants.map((tenant) => {
            const flat = myFlats.find((f) => f.id === tenant.flatId);
            const lease = leases.find((l) => l.tenantId === tenant.id);
            const tenantDeps = dependents.filter((d) => d.linkedToId === tenant.id);

            return (
              <div key={tenant.id} className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {tenant.fullName.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                        {tenant.fullName}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        Resident at Flat {flat?.fullFlatCode} ({flat?.floor})
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${getStatusBadgeClass(tenant.status || 'active')}`}>
                    {getStatusLabel(tenant.status || 'active')}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Bio-Data & Employment
                    </div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div>Occupation: <strong>{tenant.occupation}</strong></div>
                      <div>Employer: {tenant.employer}</div>
                      <div>Phone: <strong>{tenant.phone}</strong></div>
                      <div>Email: {tenant.email}</div>
                    </div>
                  </div>

                  {(() => {
                    const startD = tenant.leaseStart || tenant.rentStartDate || '2026-01-01';
                    const endD = tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31';
                    const rentCycle = getRentCycleDetails(startD, endD);
                    return (
                      <div style={{ backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#166534', textTransform: 'uppercase', fontWeight: 700 }}>
                            Annual Rent & Cycle
                          </div>
                          <span className={`badge ${rentCycle.badgeClass}`} style={{ fontSize: '0.675rem' }}>
                            {rentCycle.badgeLabel}
                          </span>
                        </div>
                        <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div>Annual Rent: <strong style={{ color: '#166534' }}>{formatNaira(tenant.rentAmount || tenant.annualRentAmount || 1200000)}</strong></div>
                          <div>Cycle: {formatDate(startD)} – {formatDate(endD)}</div>
                          <div>Doc: <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{(lease as any)?.agreementDocName || 'Digital Tenancy Agreement'}</span></div>
                          <div style={{ marginTop: '0.35rem', height: 6, backgroundColor: '#DCFCE7', borderRadius: 99, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${rentCycle.progressPercent}%`,
                                backgroundColor: rentCycle.isExpired ? '#DC2626' : rentCycle.isExpiringSoon ? '#D97706' : '#16A34A',
                              }}
                            />
                          </div>
                          <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                            Administered by PHDL SuperAdmin
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Next of Kin Record
                    </div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div>Name: <strong>{tenant.nextOfKinName}</strong></div>
                      <div>Relationship: {tenant.nextOfKinRelationship}</div>
                      <div>Contact: {tenant.nextOfKinPhone}</div>
                    </div>
                  </div>
                </div>

                {/* Household Dependents Registry Section */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                      Household Co-Residents / Dependents ({tenantDeps.length})
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTenantForDep(tenant);
                        setShowAddDepModal(true);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem', fontSize: '0.75rem' }}
                    >
                      <PlusCircle size={13} />
                      Register Dependent
                    </button>
                  </div>

                  {tenantDeps.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {tenantDeps.map((dep) => (
                        <div
                          key={dep.id}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <strong>{dep.fullName}</strong> ({dep.relationship}, {dep.age} years)
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)' }}>
                      No dependents registered yet for this tenant.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Onboard Tenant Modal */}
      {showOnboardModal && (
        <div className="modal-backdrop" onClick={() => setShowOnboardModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Onboard Civilian Sublet Tenant</h3>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                    Creates tenancy contract, updates flat status, and logs military audit trail
                  </div>
                </div>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleOnboardTenant}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Select Owned Flat to Sublet</label>
                  <select
                    value={targetFlatId}
                    onChange={(e) => setTargetFlatId(e.target.value)}
                    className="form-select"
                  >
                    {myFlats.map((f) => (
                      <option key={f.id} value={f.id}>
                        Flat {f.fullFlatCode} ({f.floor} - {getStatusLabel(f.status)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tenant Full Name</label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="e.g. Barrister Olumide Johnson"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={tenantEmail}
                      onChange={(e) => setTenantEmail(e.target.value)}
                      placeholder="tenant@email.com"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Occupation & Employer</label>
                    <input
                      type="text"
                      value={tenantOccupation}
                      onChange={(e) => setTenantOccupation(e.target.value)}
                      placeholder="e.g. Senior Accountant, Zenith Bank"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Annual Rent Agreed (₦)</label>
                    <input
                      type="number"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(Number(e.target.value))}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Lease End Date</label>
                    <input
                      type="date"
                      value={leaseEnd}
                      onChange={(e) => setLeaseEnd(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Next of Kin */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                    Next of Kin Contact
                  </span>
                  <div className="form-row" style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      value={nokName}
                      onChange={(e) => setNokName(e.target.value)}
                      placeholder="Next of Kin Name"
                      className="form-control"
                      required
                    />
                    <input
                      type="text"
                      value={nokPhone}
                      onChange={(e) => setNokPhone(e.target.value)}
                      placeholder="Next of Kin Phone"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowOnboardModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <UserPlus size={16} />
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dependent Modal */}
      {showAddDepModal && selectedTenantForDep && (
        <div className="modal-backdrop" onClick={() => setShowAddDepModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>
                Register Dependent for {selectedTenantForDep.fullName}
              </h3>
              <button onClick={() => setShowAddDepModal(false)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDependent}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Dependent Full Name</label>
                  <input
                    type="text"
                    value={depName}
                    onChange={(e) => setDepName(e.target.value)}
                    placeholder="e.g. Mrs. Maryam Eze or Junior Eze"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Relationship</label>
                    <select
                      value={depRel}
                      onChange={(e) => setDepRel(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Ward">Ward</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      value={depAge}
                      onChange={(e) => setDepAge(Number(e.target.value))}
                      className="form-control"
                      min={1}
                      max={100}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddDepModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Dependent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
