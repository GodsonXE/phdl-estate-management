import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { IDCard, IDCardHolderType } from '../../types';
import {
  IdCard,
  PlusCircle,
  Search,
  Filter,
  Printer,
  Eye,
  ShieldCheck,
  UserCheck,
  X,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';
import { IDCardBadge } from '../../components/idcards/IDCardBadge';
import { exportGenericToCSV } from '../../utils/exportUtils';

export const IDCardManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const lanes = store.getLanes(currentEstateId);
  const idCards = store.getIDCards(currentEstateId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLane, setSelectedLane] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<IDCard | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New Card Form State
  const [newHolderType, setNewHolderType] = useState<IDCardHolderType>('tenant');
  const [newHolderName, setNewHolderName] = useState('');
  const [newHolderRankOrRole, setNewHolderRankOrRole] = useState('Civilian Resident');
  const [newFlatCode, setNewFlatCode] = useState('L1H2A');
  const [newLaneName, setNewLaneName] = useState(lanes[0]?.name || 'Lane 1');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('+234 803 000 0000');

  const filteredCards = idCards.filter((card) => {
    if (selectedType !== 'all' && card.holderType !== selectedType) return false;
    if (selectedStatus !== 'all' && card.status !== selectedStatus) return false;
    if (selectedLane !== 'all' && card.laneName !== selectedLane) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        card.cardNumber.toLowerCase().includes(q) ||
        card.holderName.toLowerCase().includes(q) ||
        card.flatCode.toLowerCase().includes(q) ||
        card.holderRoleOrRank.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Card Number',
      'Holder Name',
      'Holder Category',
      'Rank / Designation',
      'Flat Code',
      'Lane',
      'Blood Group',
      'Emergency Contact',
      'Issue Date',
      'Expiry Date',
      'Status',
    ];

    const rows = filteredCards.map((c) => [
      c.cardNumber,
      c.holderName,
      c.holderType.toUpperCase(),
      c.holderRoleOrRank,
      c.flatCode,
      c.laneName,
      c.bloodGroup || 'N/A',
      c.emergencyContact || 'N/A',
      formatDate(c.issueDate || '2026-01-01'),
      formatDate(c.expiryDate || '2026-12-31'),
      getStatusLabel(c.status),
    ]);

    exportGenericToCSV(headers, rows, `PHDL_Smart_ID_Cards_${Date.now()}.csv`);
    setNoticeMessage(`Exported ${rows.length} ID card records to CSV.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleIssueCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cNum = `PHDL-UNT-${newHolderType.charAt(0).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newCard: IDCard = {
      id: `idc-${Date.now()}`,
      estateId: currentEstateId,
      holderType: newHolderType,
      holderId: `usr-${Date.now()}`,
      holderName: newHolderName,
      holderRoleOrRank: newHolderRankOrRole,
      flatCode: newFlatCode,
      laneName: newLaneName,
      cardNumber: cNum,
      qrData: `PHDL:UNT:${newHolderType.toUpperCase()}:${newHolderName}:${newFlatCode}:EXP-2028-12-31`,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
      status: 'active',
      bloodGroup: newBloodGroup,
      emergencyContact: newEmergencyPhone,
    };

    store.issueIDCard(newCard);
    setShowIssueModal(false);
    setSelectedCard(newCard);
    setNoticeMessage(`Issued Smart ID Card ${cNum} to ${newHolderName}.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-military">GATE SECURITY CLEARANCE</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {currentEstate?.name}
            </span>
          </div>
          <h2>Smart Estate ID Card Issuance & Registry</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Issue, track, and print tamper-proof digital ID cards with dynamic QR gate access for Soldiers, Tenants, and Dependents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-outline"
            style={{ gap: '0.4rem', borderColor: '#0284C7', color: '#0369A1' }}
          >
            <Download size={16} />
            Export ID Cards CSV ({filteredCards.length})
          </button>

          <button onClick={() => setShowIssueModal(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} />
            Issue New Smart Estate ID
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      {/* Metrics */}
      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Issued Cards</div>
            <div className="stat-value">{idCards.filter((c) => c.status === 'active').length}</div>
            <div className="stat-subtext">QR Pass Validated</div>
          </div>
          <div className="stat-icon-wrapper">
            <IdCard size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Soldier Landlord Cards</div>
            <div className="stat-value" style={{ color: 'var(--accent-800)' }}>
              {idCards.filter((c) => c.holderType === 'soldier').length}
            </div>
            <div className="stat-subtext">Armed Forces personnel</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-100)', color: 'var(--accent-800)' }}>
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Civilian & Dependent Cards</div>
            <div className="stat-value" style={{ color: '#0369A1' }}>
              {idCards.filter((c) => c.holderType === 'tenant' || c.holderType === 'dependent').length}
            </div>
            <div className="stat-subtext">Verified residential occupants</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-info-bg)', color: '#0369A1' }}>
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Card Number, Name or Flat</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. PHDL-UNT, Eze, Rose, L1H1A..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Holder Category</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="form-select">
              <option value="all">All Holder Types</option>
              <option value="soldier">Soldier / Landlord</option>
              <option value="tenant">Civilian Tenant</option>
              <option value="dependent">Household Dependent</option>
              <option value="contractor">Contractor / Facility</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Lane</label>
            <select value={selectedLane} onChange={(e) => setSelectedLane(e.target.value)} className="form-select">
              <option value="all">All Lanes</option>
              {lanes.map((l) => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Card Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <IdCard size={18} />
            Estate Identification Database ({filteredCards.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Card Number</th>
                <th>Holder Full Name</th>
                <th>Holder Category</th>
                <th>Assigned Unit</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary-900)' }}>
                    {card.cardNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{card.holderName}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>{card.holderRoleOrRank}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {card.holderType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{card.flatCode}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>{card.laneName}</div>
                  </td>
                  <td>{formatDate(card.issueDate || '2026-01-01')}</td>
                  <td>{formatDate(card.expiryDate || '2026-12-31')}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(card.status)}`}>
                      {getStatusLabel(card.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedCard(card)}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem', padding: '0.3rem 0.6rem' }}
                    >
                      <Eye size={13} />
                      View Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID Card Preview & Print Modal */}
      {selectedCard && (
        <div className="modal-backdrop" onClick={() => setSelectedCard(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IdCard size={20} color="var(--primary-800)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Smart Digital Pass: {selectedCard.holderName}
                </h3>
              </div>
              <button onClick={() => setSelectedCard(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <IDCardBadge card={selectedCard} />
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setSelectedCard(null)} className="btn btn-outline">
                Close
              </button>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Printer size={16} />
                Print Physical Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="modal-backdrop" onClick={() => setShowIssueModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <form onSubmit={handleIssueCard}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PlusCircle size={20} color="var(--primary-800)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Issue New Smart ID Card</h3>
                </div>
                <button type="button" onClick={() => setShowIssueModal(false)} className="btn btn-ghost btn-sm">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Holder Type</label>
                  <select
                    value={newHolderType}
                    onChange={(e) => setNewHolderType(e.target.value as IDCardHolderType)}
                    className="form-select"
                  >
                    <option value="tenant">Civilian Tenant</option>
                    <option value="soldier">Soldier / Landlord</option>
                    <option value="dependent">Household Dependent</option>
                    <option value="contractor">Facility Contractor / Worker</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name of Holder</label>
                  <input
                    type="text"
                    required
                    value={newHolderName}
                    onChange={(e) => setNewHolderName(e.target.value)}
                    placeholder="e.g. Mrs. Aisha Bello"
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Rank or Professional Role</label>
                  <input
                    type="text"
                    required
                    value={newHolderRankOrRole}
                    onChange={(e) => setNewHolderRankOrRole(e.target.value)}
                    placeholder="e.g. Corporate Lawyer / Student / Master Warrant Officer"
                    className="form-control"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Flat Code</label>
                    <input
                      type="text"
                      required
                      value={newFlatCode}
                      onChange={(e) => setNewFlatCode(e.target.value)}
                      placeholder="e.g. L1H1A"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Lane</label>
                    <select
                      value={newLaneName}
                      onChange={(e) => setNewLaneName(e.target.value)}
                      className="form-select"
                    >
                      {lanes.map((l) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Blood Group</label>
                    <select
                      value={newBloodGroup}
                      onChange={(e) => setNewBloodGroup(e.target.value)}
                      className="form-select"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Emergency Phone</label>
                    <input
                      type="text"
                      value={newEmergencyPhone}
                      onChange={(e) => setNewEmergencyPhone(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowIssueModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate & Activate ID Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
