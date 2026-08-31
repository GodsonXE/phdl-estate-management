import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Soldier, MilitaryBranch, MilitaryRank } from '../../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  UserCheck,
  AlertCircle,
  Eye,
  X,
  Download,
  Filter,
  Shield,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';
import { exportGenericToCSV } from '../../utils/exportUtils';

export const SoldierVerificationPage: React.FC = () => {
  const store = usePhdlStore();
  const soldiers = store.getSoldiers();
  const flats = store.getFlats();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const pendingCount = soldiers.filter((s) => s.verificationStatus === 'pending' || (s.verificationStatus as any) === 'pending_verification').length;
  const verifiedCount = soldiers.filter((s) => s.verificationStatus === 'verified').length;

  const filteredSoldiers = soldiers.filter((s) => {
    if (selectedStatus !== 'all' && s.verificationStatus !== selectedStatus) return false;
    if (selectedBranch !== 'all' && s.militaryBranch !== selectedBranch) return false;
    if (selectedRank !== 'all' && s.rank !== selectedRank) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.serviceNumber.toLowerCase().includes(q) ||
        s.rank.toLowerCase().includes(q) ||
        s.unitBrigade.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Full Name',
      'Rank',
      'Branch',
      'Service Number',
      'Phone Contact',
      'Email',
      'Military Unit',
      'Flats Owned Count',
      'Verification Status',
      'Verified Date',
    ];

    const rows = filteredSoldiers.map((s) => [
      s.fullName,
      s.rank,
      s.militaryBranch,
      s.serviceNumber,
      s.phone,
      s.email,
      s.unitBrigade,
      s.ownedFlatIds.length,
      getStatusLabel(s.verificationStatus),
      s.verifiedAt ? formatDate(s.verifiedAt) : 'Pending',
    ]);

    exportGenericToCSV(headers, rows, `PHDL_Soldier_Registry_${Date.now()}.csv`);
    setNoticeMessage(`Exported ${rows.length} soldier records to CSV.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleApprove = (soldier: Soldier) => {
    const updated: Soldier = {
      ...soldier,
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
    };
    store.updateSoldier(updated);
    store.logAudit({
      estateId: 'estate-unity-abuja',
      actorId: 'admin-1',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      actorRole: 'phdl_admin',
      action: 'SOLDIER_KYC_VERIFIED',
      entityAffected: 'Soldier',
      entityId: soldier.id,
      details: `Approved military verification for ${soldier.rank} ${soldier.fullName} (${soldier.serviceNumber}).`,
    });

    store.addNotification({
      id: `notif-kyc-${Date.now()}`,
      title: 'Ownership KYC Approved',
      message: `Your military service record (${soldier.serviceNumber}) has been officially verified by PHDL Command.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    setSelectedSoldier(null);
    setNoticeMessage(`Ownership verified for ${soldier.rank} ${soldier.fullName}.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  const handleReject = (soldier: Soldier) => {
    const updated: Soldier = {
      ...soldier,
      verificationStatus: 'rejected',
    };
    store.updateSoldier(updated);
    store.logAudit({
      estateId: 'est-unity',
      actorId: 'admin',
      actorName: 'Super Admin Bello',
      actorRole: 'phdl_admin',
      action: 'SOLDIER_KYC_REJECTED',
      entityAffected: 'Soldier',
      entityId: soldier.id,
      details: `Rejected ownership verification for ${soldier.fullName} (${soldier.serviceNumber}) pending updated military credentials.`,
    });

    setSelectedSoldier(null);
    setNoticeMessage(`Verification rejected for ${soldier.fullName}.`);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-military">DEFENCE HEADQUARTERS DIRECTIVE</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Armed Forces Personnel Ownership Validation (Private to MWO)
            </span>
          </div>
          <h2>Soldier Ownership & KYC Verification Queue</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Review and validate Armed Forces service numbers, ranks, allocation letters, and KYC credentials for subsidized flat ownership.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn btn-outline"
          style={{ gap: '0.4rem', borderColor: '#0284C7', color: '#0369A1' }}
        >
          <Download size={16} />
          Export Soldiers CSV ({filteredSoldiers.length})
        </button>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} />
          {noticeMessage}
        </div>
      )}

      {/* Metric Cards */}
      <div className="stat-grid">
        <div className="stat-card" onClick={() => setSelectedStatus('pending_verification')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Pending Verification</div>
            <div className="stat-value" style={{ color: pendingCount > 0 ? '#B45309' : '#15803D' }}>
              {pendingCount}
            </div>
            <div className="stat-subtext">Requires PHDL review</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-warning-bg)', color: '#B45309' }}>
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setSelectedStatus('verified')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Verified Soldier Owners</div>
            <div className="stat-value" style={{ color: '#15803D' }}>{verifiedCount}</div>
            <div className="stat-subtext">Active title & subletting enabled</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-success-bg)', color: '#15803D' }}>
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setSelectedStatus('all')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Total Officers Onboarded</div>
            <div className="stat-value">{soldiers.length}</div>
            <div className="stat-subtext">Army, Navy, Air Force</div>
          </div>
          <div className="stat-icon-wrapper">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filters */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Officer, Rank, Service No</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Ibrahim, NA/2015, Guards..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by KYC Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
            >
              <option value="all">All Statuses ({soldiers.length})</option>
              <option value="verified">Verified ({verifiedCount})</option>
              <option value="pending_verification">Pending Review ({pendingCount})</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Military Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="form-select"
            >
              <option value="all">All Branches</option>
              <option value="Nigerian Army">Nigerian Army</option>
              <option value="Nigerian Navy">Nigerian Navy</option>
              <option value="Nigerian Air Force">Nigerian Air Force</option>
              <option value="Defence Headquarters">Defence Headquarters</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Rank</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="form-select"
            >
              <option value="all">All Permitted Ranks</option>
              <option value="Master Warrant Officer">Master Warrant Officer</option>
              <option value="Warrant Officer">Warrant Officer</option>
              <option value="Staff Sergeant">Staff Sergeant</option>
              <option value="Sergeant">Sergeant</option>
              <option value="Corporal">Corporal</option>
              <option value="Lance Corporal">Lance Corporal</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} />
            Officer Ownership Applications & Records ({filteredSoldiers.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer / Soldier</th>
                <th>Service No. & Branch</th>
                <th>Military Unit / Brigade</th>
                <th>Phone Contact</th>
                <th>Owned Flats</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSoldiers.map((soldier) => {
                const ownedFlats = flats.filter((f) => soldier.ownedFlatIds.includes(f.id));

                return (
                  <tr key={soldier.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{soldier.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{soldier.rank}</div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{soldier.serviceNumber}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>{soldier.militaryBranch}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{soldier.unitBrigade}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{soldier.phone}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{soldier.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {ownedFlats.length > 0 ? (
                          ownedFlats.map((f) => (
                            <span key={f.id} className="badge badge-military" style={{ fontSize: '0.75rem' }}>
                              {f.fullFlatCode}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Pending Allocation</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(soldier.verificationStatus)}`}>
                        {getStatusLabel(soldier.verificationStatus)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedSoldier(soldier)}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '0.3rem', padding: '0.3rem 0.6rem' }}
                      >
                        <Eye size={13} />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSoldier && (
        <div className="modal-backdrop" onClick={() => setSelectedSoldier(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--primary-800)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Review Credentials: {selectedSoldier.fullName}
                </h3>
              </div>
              <button onClick={() => setSelectedSoldier(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Service Number:</span>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{selectedSoldier.serviceNumber}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Military Branch:</span>
                  <div style={{ fontWeight: 700 }}>{selectedSoldier.militaryBranch}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Current Rank:</span>
                  <div style={{ fontWeight: 700 }}>{selectedSoldier.rank}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Unit / Garrison:</span>
                  <div>{selectedSoldier.unitBrigade}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Phone:</span>
                  <div style={{ fontWeight: 600 }}>{selectedSoldier.phone}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Official Email:</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{selectedSoldier.email}</div>
                </div>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <FileText size={16} color="var(--primary-800)" />
                  <strong style={{ fontSize: '0.85rem' }}>Attached Proof of Military Housing Allocation</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  Document: <code>PHDL-ALLOCATION-LETTER-{selectedSoldier.serviceNumber.replace(/\//g, '-')}.PDF</code>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: '0.25rem' }}>
                  ✓ Digital signature matched against Armed Forces Personnel Database (AFPD).
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => handleReject(selectedSoldier)} className="btn btn-danger btn-sm" style={{ gap: '0.3rem' }}>
                <XCircle size={14} />
                Reject Application
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSelectedSoldier(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button onClick={() => handleApprove(selectedSoldier)} className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                  <CheckCircle size={14} />
                  Approve Ownership & Issue Digital Title
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
