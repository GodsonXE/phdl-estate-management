import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Flat, FlatStatus, MilitaryRank, MilitaryBranch } from '../../types';
import {
  Building2,
  Home,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  PlusCircle,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Shield,
  Phone,
  Mail,
  User,
  Download,
  Printer,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  Lock,
} from 'lucide-react';
import {
  formatNaira,
  formatDate,
  getStatusBadgeClass,
  getStatusLabel,
  getRentCycleDetails,
} from '../../utils/formatters';
import { exportFlatsToCSV, printOrExportPDFRoster, ExportEstateRow } from '../../utils/exportUtils';
import { BulkImportModal } from './BulkImportModal';

const PERMITTED_SOLDIER_RANKS: MilitaryRank[] = [
  'Master Warrant Officer',
  'Warrant Officer',
  'Staff Sergeant',
  'Sergeant',
  'Corporal',
  'Lance Corporal',
  'Private',
];

const MILITARY_BRANCHES: MilitaryBranch[] = [
  'Nigerian Army',
  'Nigerian Navy',
  'Nigerian Air Force',
  'Defence Headquarters',
];

export const EstateHierarchyPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const lanes = store.getLanes(currentEstateId);
  const allFlats = store.getFlats(currentEstateId);
  const soldiers = store.getSoldiers();
  const tenants = store.getTenants();
  const bills = store.getBills(currentEstateId);
  const maintenance = store.getMaintenanceRequests(currentEstateId);
  const dependents = store.getDependents();

  const [selectedLaneId, setSelectedLaneId] = useState<string>('all');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Edit Form State
  const [editStatus, setEditStatus] = useState<FlatStatus>('unoccupied');
  const [editMeter, setEditMeter] = useState('');
  const [editLandlordName, setEditLandlordName] = useState('');
  const [editLandlordPhone, setEditLandlordPhone] = useState('');
  const [editLandlordServiceNo, setEditLandlordServiceNo] = useState('');
  const [editLandlordRank, setEditLandlordRank] = useState<MilitaryRank>('Sergeant');
  const [editLandlordBranch, setEditLandlordBranch] = useState<MilitaryBranch>('Nigerian Army');
  const [editTenantName, setEditTenantName] = useState('');
  const [editTenantEmail, setEditTenantEmail] = useState('');
  const [editTenantPhone, setEditTenantPhone] = useState('');
  const [editTenantOccupation, setEditTenantOccupation] = useState('');
  const [editRentAmount, setEditRentAmount] = useState<number>(1800000);
  const [editLeaseStart, setEditLeaseStart] = useState<string>('2025-10-01');
  const [editLeaseEnd, setEditLeaseEnd] = useState<string>('2026-09-30');

  // Open Edit Modal
  const handleOpenEdit = (flat: Flat) => {
    const owner = soldiers.find((s) => s.id === flat.ownerId);
    const tenant = tenants.find((t) => t.id === flat.currentTenantId);

    setEditingFlat(flat);
    setEditStatus(flat.status);
    setEditMeter(flat.meterNumber || '');
    setEditLandlordName(owner?.fullName === 'UnIdentified Soldier' ? '' : owner?.fullName || '');
    setEditLandlordPhone(owner?.phone === 'N/A' ? '' : owner?.phone || '');
    setEditLandlordServiceNo(owner?.serviceNumber === 'NA/PENDING/000' ? '' : owner?.serviceNumber || '');
    setEditLandlordRank(owner?.rank || 'Sergeant');
    setEditLandlordBranch(owner?.militaryBranch || 'Nigerian Army');
    setEditTenantName(tenant?.fullName === 'Unconfirmed Tenant' ? '' : tenant?.fullName || '');
    setEditTenantEmail(tenant?.email === 'N/A' ? '' : tenant?.email || '');
    setEditTenantPhone(tenant?.phone === 'N/A' ? '' : tenant?.phone || '');
    setEditTenantOccupation(tenant?.occupation || 'Civilian Resident');
    setEditRentAmount(tenant?.rentAmount || 1800000);
    setEditLeaseStart(tenant?.leaseStart || '2025-10-01');
    setEditLeaseEnd(tenant?.leaseEnd || '2026-09-30');
  };

  // Helper when user changes lease start date: automatically set 1 year cycle
  const handleLeaseStartChange = (startDateStr: string) => {
    setEditLeaseStart(startDateStr);
    try {
      const d = new Date(startDateStr);
      d.setFullYear(d.getFullYear() + 1);
      d.setDate(d.getDate() - 1);
      setEditLeaseEnd(d.toISOString().split('T')[0]);
    } catch {
      // Keep existing
    }
  };

  // Save Allocation Form
  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlat) return;

    store.updateFlatAllocation({
      flatId: editingFlat.id,
      status: editStatus,
      meterNumber: editMeter,
      landlordName: editLandlordName.trim() || 'UnIdentified Soldier',
      landlordPhone: editLandlordPhone.trim() || 'N/A',
      landlordServiceNumber: editLandlordServiceNo.trim() || undefined,
      landlordRank: editLandlordRank,
      landlordBranch: editLandlordBranch,
      tenantName: editTenantName.trim() || 'Unconfirmed Tenant',
      tenantEmail: editTenantEmail.trim() || 'N/A',
      tenantPhone: editTenantPhone.trim() || 'N/A',
      tenantOccupation: editTenantOccupation.trim() || 'Civilian Resident',
      rentAmount: editRentAmount,
      leaseStart: editLeaseStart,
      leaseEnd: editLeaseEnd,
    });

    const updatedFlat = store.getFlatById(editingFlat.id);
    if (selectedFlat && selectedFlat.id === editingFlat.id && updatedFlat) {
      setSelectedFlat(updatedFlat);
    }

    setEditingFlat(null);
    setNoticeMessage(`Flat ${editingFlat.fullFlatCode} allocation & rent cycle updated by SuperAdmin.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  // Advanced Filter Logic
  const filteredFlats = allFlats.filter((flat) => {
    const owner = soldiers.find((s) => s.id === flat.ownerId);
    const tenant = tenants.find((t) => t.id === flat.currentTenantId);

    const isUnidentifiedOwner = !owner || owner.fullName === 'UnIdentified Soldier';
    const isConfirmedLandlord = owner && owner.fullName !== 'UnIdentified Soldier';
    const isOccupied = flat.status === 'sublet' || flat.status === 'owner_occupied';

    // Lane Filter
    if (selectedLaneId !== 'all' && flat.laneId !== selectedLaneId) return false;

    // Floor Filter
    if (selectedFloor !== 'all' && flat.floor !== selectedFloor) return false;

    // Specific Granular Category Filters
    if (selectedFilterCategory === 'occupied_all' && !isOccupied) return false;
    if (selectedFilterCategory === 'occupied_confirmed_landlord' && (!isOccupied || !isConfirmedLandlord)) return false;
    if (selectedFilterCategory === 'occupied_unidentified_soldier' && (!isOccupied || !isUnidentifiedOwner)) return false;
    if (selectedFilterCategory === 'unoccupied' && flat.status !== 'unoccupied') return false;
    if (selectedFilterCategory === 'sublet' && flat.status !== 'sublet') return false;
    if (selectedFilterCategory === 'owner_occupied' && flat.status !== 'owner_occupied') return false;
    if (selectedFilterCategory === 'vacant' && flat.status !== 'vacant') return false;
    if (selectedFilterCategory === 'under_maintenance' && flat.status !== 'under_maintenance') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        flat.fullFlatCode.toLowerCase().includes(q) ||
        (flat.meterNumber || '').toLowerCase().includes(q) ||
        (owner && (owner.fullName.toLowerCase().includes(q) || owner.serviceNumber.toLowerCase().includes(q) || owner.phone.includes(q))) ||
        (tenant && (tenant.fullName.toLowerCase().includes(q) || tenant.phone.includes(q) || tenant.email.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Calculate statistics
  const totalFlatsCount = allFlats.length;
  const ownerOccupiedCount = allFlats.filter((f) => f.status === 'owner_occupied').length;
  const subletCount = allFlats.filter((f) => f.status === 'sublet').length;
  const unoccupiedCount = allFlats.filter((f) => f.status === 'unoccupied').length;
  const vacantCount = allFlats.filter((f) => f.status === 'vacant').length;
  const maintenanceCount = allFlats.filter((f) => f.status === 'under_maintenance').length;

  const occupiedUnidentifiedCount = allFlats.filter((f) => {
    const isOcc = f.status === 'sublet' || f.status === 'owner_occupied';
    const owner = soldiers.find((s) => s.id === f.ownerId);
    return isOcc && (!owner || owner.fullName === 'UnIdentified Soldier');
  }).length;

  const occupiedConfirmedLandlordCount = allFlats.filter((f) => {
    const isOcc = f.status === 'sublet' || f.status === 'owner_occupied';
    const owner = soldiers.find((s) => s.id === f.ownerId);
    return isOcc && owner && owner.fullName !== 'UnIdentified Soldier';
  }).length;

  const occupancyRate = totalFlatsCount > 0 ? Math.round(((ownerOccupiedCount + subletCount) / totalFlatsCount) * 100) : 0;

  // CSV Export Handler
  const handleExportCSV = () => {
    const rows: ExportEstateRow[] = filteredFlats.map((flat) => {
      const lane = lanes.find((l) => l.id === flat.laneId);
      const owner = soldiers.find((s) => s.id === flat.ownerId);
      const tenant = tenants.find((t) => t.id === flat.currentTenantId);

      const houseNum = flat.houseNumber || (flat.buildingId ? (flat.buildingId.includes('-h') ? flat.buildingId.split('-h')[1] : flat.buildingId.replace('bld-', '')) : '1');

      const rentInfo = tenant ? getRentCycleDetails(tenant.leaseStart || tenant.rentStartDate || '2026-01-01', tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31') : null;

      return {
        flatCode: flat.fullFlatCode,
        lane: lane?.name || 'Lane',
        house: `House ${houseNum}`,
        floor: flat.floor || 'Ground Floor',
        flatType: '2-Bedroom Flat',
        status: getStatusLabel(flat.status),
        landlordRank: owner?.rank || 'N/A',
        landlordName: owner?.fullName || 'UnIdentified Soldier',
        landlordPhone: owner?.phone || 'N/A',
        landlordServiceNo: owner?.serviceNumber || 'N/A',
        tenantName: tenant?.fullName || 'Unconfirmed Tenant',
        tenantPhone: tenant?.phone || 'N/A',
        tenantEmail: tenant?.email || 'N/A',
        rentAmount: tenant ? String(tenant.rentAmount || tenant.annualRentAmount || 1200000) : 'N/A',
        rentStartDate: tenant ? (tenant.leaseStart || tenant.rentStartDate || 'N/A') : 'N/A',
        rentExpiryDate: tenant ? (tenant.leaseEnd || tenant.rentExpiryDate || 'N/A') : 'N/A',
        rentCycleStatus: rentInfo ? rentInfo.badgeLabel : 'N/A',
        meterNumber: flat.meterNumber || 'N/A',
      };
    });

    exportFlatsToCSV(rows, `PHDL_Unity_Estate_404_Flats_${Date.now()}.csv`);
    setNoticeMessage(`Exported ${rows.length} flats to CSV with rent cycle details.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // PDF / Print Roster Handler
  const handleExportPDF = () => {
    const headers = [
      'Flat Code',
      'Lane & House',
      'Floor (2-Bed)',
      'Status',
      'Landlord (Soldier)',
      'Landlord Phone',
      'Tenant (Civilian)',
      'Rent Paid / Cycle',
      'Meter No',
    ];

    const rows = filteredFlats.map((flat) => {
      const lane = lanes.find((l) => l.id === flat.laneId);
      const owner = soldiers.find((s) => s.id === flat.ownerId);
      const tenant = tenants.find((t) => t.id === flat.currentTenantId);

      const houseNum = flat.houseNumber || (flat.buildingId ? (flat.buildingId.includes('-h') ? flat.buildingId.split('-h')[1] : flat.buildingId.replace('bld-', '')) : '1');

      const landlordStr = owner && owner.fullName !== 'UnIdentified Soldier'
        ? `${owner.rank} ${owner.fullName}`
        : 'UnIdentified Soldier';

      const tenantStr = tenant && tenant.fullName !== 'Unconfirmed Tenant'
        ? `${tenant.fullName} (${tenant.phone})`
        : 'Unconfirmed Tenant';

      const rentStr = tenant
        ? `${formatNaira(tenant.rentAmount || tenant.annualRentAmount || 1200000)}/yr (${formatDate(tenant.leaseStart || tenant.rentStartDate || '2026-01-01')} - ${formatDate(tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31')})`
        : 'N/A';

      return [
        flat.fullFlatCode,
        `${lane?.name}, H${houseNum}`,
        flat.floor || 'Ground Floor',
        getStatusLabel(flat.status),
        landlordStr,
        owner?.phone || 'N/A',
        tenantStr,
        rentStr,
        flat.meterNumber || 'N/A',
      ];
    });

    printOrExportPDFRoster({
      title: 'Official Estate Clearance & Tenancy Cycle Roster',
      estateName: currentEstate?.name || 'PHDL Unity Estate',
      subtitle: `404 Total Units (All 2-Bedroom Flats) • 8 Lanes • 101 Blocks • Filter: ${selectedFilterCategory.replace(/_/g, ' ').toUpperCase()}`,
      statsSummary: `Total Units: ${totalFlatsCount} | Filtered Units: ${filteredFlats.length} | Occupied: ${ownerOccupiedCount + subletCount} (${occupancyRate}%) | Unoccupied: ${unoccupiedCount} | Sublets: ${subletCount}`,
      headers,
      rows,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-military">{currentEstate?.code}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {currentEstate?.state} • Subsidized Soldier Housing (All 2-Bedroom Flats • Private to MWO)
            </span>
          </div>
          <h2>{currentEstate?.name} Infrastructure Hierarchy</h2>
          <p style={{ fontSize: '0.875rem' }}>
            Authenticated registry with dynamic annual rent cycle calculation, renewal reminders, and SuperAdmin-controlled rent ledger.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-outline"
            style={{ gap: '0.4rem', borderColor: '#0284C7', color: '#0369A1' }}
            title="Download CSV Spreadsheet with Rent Cycle"
          >
            <Download size={16} />
            Export CSV ({filteredFlats.length})
          </button>

          <button
            onClick={handleExportPDF}
            className="btn btn-outline"
            style={{ gap: '0.4rem', borderColor: '#15803D', color: '#166534' }}
            title="Print Official PDF Tenancy Roster"
          >
            <Printer size={16} />
            Export / Print PDF
          </button>

          <button
            onClick={() => setShowBulkImport(true)}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <FileSpreadsheet size={16} />
            Bulk CSV Importer
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      {/* Metric Cards Bar */}
      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Housing Units</div>
            <div className="stat-value">{totalFlatsCount}</div>
            <div className="stat-subtext">All 2-Bedroom Flats (8 Lanes • 101 Blocks)</div>
          </div>
          <div className="stat-icon-wrapper">
            <Building2 size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setSelectedFilterCategory('occupied_all')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Total Occupied Flats</div>
            <div className="stat-value" style={{ color: '#15803D' }}>{ownerOccupiedCount + subletCount}</div>
            <div className="stat-subtext">
              {occupancyRate}% Rate • {occupiedConfirmedLandlordCount} Confirmed Landlords
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--status-success-bg)', color: '#15803D' }}>
            <Home size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setSelectedFilterCategory('occupied_unidentified_soldier')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Occupied (Unidentified Soldier)</div>
            <div className="stat-value" style={{ color: '#D97706' }}>{occupiedUnidentifiedCount}</div>
            <div className="stat-subtext">Tenant active, landlord N/A</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Shield size={22} />
          </div>
        </div>

        <div className="stat-card" onClick={() => setSelectedFilterCategory('unoccupied')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="stat-label">Unoccupied Flats (Empty)</div>
            <div className="stat-value" style={{ color: '#64748B' }}>{unoccupiedCount}</div>
            <div className="stat-subtext">Both soldier & tenant unassigned</div>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
            <Zap size={22} />
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filter & Search Console */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Filter size={16} color="var(--primary-700)" />
          <strong style={{ fontSize: '0.85rem', color: 'var(--primary-900)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Filter & Search Registry ({filteredFlats.length} Flats Matching)
          </strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Search Box */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Flats, Contacts, Names</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. L1H1A, 0812..., Rose Apuu..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          {/* Granular Occupancy / Allocation Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Occupancy & Allocation Category</label>
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">All 404 Housing Units</option>
              <option value="occupied_all">🟢 All Occupied Units ({ownerOccupiedCount + subletCount})</option>
              <option value="occupied_confirmed_landlord">🎖️ Occupied with Confirmed Landlord ({occupiedConfirmedLandlordCount})</option>
              <option value="occupied_unidentified_soldier">⚠️ Occupied with UnIdentified Soldier ({occupiedUnidentifiedCount})</option>
              <option value="unoccupied">⚪ Unoccupied / Empty Units ({unoccupiedCount})</option>
              <option value="sublet">👥 Civilian Sublets ({subletCount})</option>
              <option value="owner_occupied">🛡️ Owner-Occupied Units ({ownerOccupiedCount})</option>
              <option value="vacant">🔵 Vacant Units ({vacantCount})</option>
              <option value="under_maintenance">🔧 Under Maintenance ({maintenanceCount})</option>
            </select>
          </div>

          {/* Lane Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Lane</label>
            <select
              value={selectedLaneId}
              onChange={(e) => setSelectedLaneId(e.target.value)}
              className="form-select"
            >
              <option value="all">All 8 Lanes ({totalFlatsCount} Flats)</option>
              {lanes.map((lane) => (
                <option key={lane.id} value={lane.id}>
                  {lane.name} ({(lane.totalBuildings || lane.blockCount || 1) * 4} Flats)
                </option>
              ))}
            </select>
          </div>

          {/* Floor Level Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Floor / Unit Position</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="form-select"
            >
              <option value="all">All Floors (All Units A-D)</option>
              <option value="Ground Floor Left">Ground Floor Left (Unit A)</option>
              <option value="Ground Floor Right">Ground Floor Right (Unit B)</option>
              <option value="First Floor Left">First Floor Left (Unit C)</option>
              <option value="First Floor Right">First Floor Right (Unit D)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tag Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', alignSelf: 'center', marginRight: '0.3rem' }}>Quick Filters:</span>
          <button
            onClick={() => setSelectedFilterCategory('all')}
            className={`btn btn-sm ${selectedFilterCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
          >
            All ({totalFlatsCount})
          </button>
          <button
            onClick={() => setSelectedFilterCategory('occupied_all')}
            className={`btn btn-sm ${selectedFilterCategory === 'occupied_all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
          >
            Occupied ({ownerOccupiedCount + subletCount})
          </button>
          <button
            onClick={() => setSelectedFilterCategory('occupied_unidentified_soldier')}
            className={`btn btn-sm ${selectedFilterCategory === 'occupied_unidentified_soldier' ? 'btn-accent' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
          >
            Occupied w/ UnIdentified Soldier ({occupiedUnidentifiedCount})
          </button>
          <button
            onClick={() => setSelectedFilterCategory('unoccupied')}
            className={`btn btn-sm ${selectedFilterCategory === 'unoccupied' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
          >
            Unoccupied / Empty ({unoccupiedCount})
          </button>
          <button
            onClick={() => setSelectedFilterCategory('sublet')}
            className={`btn btn-sm ${selectedFilterCategory === 'sublet' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
          >
            Civilian Sublets ({subletCount})
          </button>
        </div>
      </div>

      {/* Flats Data Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Building2 size={18} />
            Estate Flat Inventory ({filteredFlats.length} Flats Displayed)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              All 2-Bedroom Units • Showing {Math.min(100, filteredFlats.length)} of {filteredFlats.length}
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Unit Code</th>
                <th>Lane & Building</th>
                <th>Floor / Type</th>
                <th>Status</th>
                <th>Landlord (Soldier)</th>
                <th>Tenant & Annual Rent Cycle</th>
                <th>Electricity Meter</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlats.slice(0, 100).map((flat) => {
                const lane = lanes.find((l) => l.id === flat.laneId);
                const owner = soldiers.find((s) => s.id === flat.ownerId);
                const tenant = tenants.find((t) => t.id === flat.currentTenantId);

                const isUnidentifiedOwner = !owner || owner.fullName === 'UnIdentified Soldier';
                const isUnconfirmedTenant = !tenant || tenant.fullName === 'Unconfirmed Tenant';
                const rentCycle = tenant ? getRentCycleDetails(tenant.leaseStart || tenant.rentStartDate || '2026-01-01', tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31') : null;

                return (
                  <tr key={flat.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'var(--font-mono)' }}>
                        {flat.fullFlatCode}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Unit {flat.unitLabel || flat.flatLetter}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{lane?.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                        House {flat.houseNumber || (flat.buildingId ? (flat.buildingId.includes('-h') ? flat.buildingId.split('-h')[1] : flat.buildingId.replace('bld-', '')) : '1')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{flat.floor || 'Ground Floor'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#0369A1', fontWeight: 600 }}>
                        2-Bedroom Flat
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(flat.status)}`}>
                        {getStatusLabel(flat.status)}
                      </span>
                    </td>
                    <td>
                      {isUnidentifiedOwner ? (
                        <div>
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            UnIdentified Soldier
                          </span>
                          <div style={{ fontSize: '0.675rem', color: '#94A3B8' }}>Pending allocation update</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--primary-900)' }}>
                            {owner.rank} {owner.fullName}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                            {owner.phone !== 'N/A' ? owner.phone : 'Phone: N/A'}
                          </div>
                          <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                            {owner.serviceNumber}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {flat.status === 'sublet' && tenant ? (
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0369A1' }}>{tenant.fullName}</div>
                          <div style={{ fontSize: '0.725rem', color: '#0284C7', fontWeight: 600 }}>
                            {tenant.phone !== 'N/A' ? tenant.phone : 'Phone: N/A'}
                          </div>
                          {/* Rent Amount and Annual Cycle */}
                          <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                              {formatNaira(tenant.rentAmount || tenant.annualRentAmount || 1200000)} / year
                            </div>
                            {rentCycle && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span className={`badge ${rentCycle.badgeClass}`} style={{ fontSize: '0.675rem', padding: '0.1rem 0.4rem' }}>
                                  <Clock size={10} style={{ marginRight: '0.2rem' }} />
                                  {rentCycle.badgeLabel}
                                </span>
                                <span style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                                  ({formatDate(tenant.leaseStart || tenant.rentStartDate || '2026-01-01')} – {formatDate(tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31')})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : flat.status === 'owner_occupied' ? (
                        <div>
                          <span style={{ fontSize: '0.775rem', color: '#15803D', fontWeight: 600 }}>Owner-Occupied</span>
                          {owner && owner.phone !== 'N/A' && <div style={{ fontSize: '0.7rem', color: '#166534' }}>{owner.phone}</div>}
                        </div>
                      ) : flat.status === 'unoccupied' ? (
                        <div>
                          <span style={{ fontSize: '0.775rem', color: '#64748B', fontStyle: 'italic' }}>Unconfirmed Tenant</span>
                          <div style={{ fontSize: '0.675rem', color: '#94A3B8' }}>Unoccupied flat</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Vacant</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem' }}>
                      {flat.meterNumber}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => setSelectedFlat(flat)}
                          className="btn btn-outline btn-sm"
                          style={{ gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Inspect Details"
                        >
                          <Eye size={13} />
                          Inspect
                        </button>
                        <button
                          onClick={() => handleOpenEdit(flat)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="SuperAdmin Edit Allocation & Rent"
                        >
                          <Edit size={13} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredFlats.length > 100 && (
          <div style={{ padding: '0.85rem', textAlign: 'center', backgroundColor: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            Displaying first 100 of {filteredFlats.length} flats matching query. Use filters above or Export to CSV/PDF to view all rows.
          </div>
        )}
      </div>

      {/* Flat Detail Inspection Modal */}
      {selectedFlat && (
        <div className="modal-backdrop" onClick={() => setSelectedFlat(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Flat Inspection: {selectedFlat.fullFlatCode}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {lanes.find((l) => l.id === selectedFlat.laneId)?.name} • {selectedFlat.floor} (2-Bedroom Flat)
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFlat(null)} className="btn btn-ghost btn-sm">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Status Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Current Occupancy Status</div>
                  <span className={`badge ${getStatusBadgeClass(selectedFlat.status)}`} style={{ marginTop: '0.2rem', fontSize: '0.85rem' }}>
                    {getStatusLabel(selectedFlat.status)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const f = selectedFlat;
                    setSelectedFlat(null);
                    handleOpenEdit(f);
                  }}
                  className="btn btn-accent btn-sm"
                  style={{ gap: '0.35rem', backgroundColor: '#F0D07C' }}
                >
                  <Edit size={14} />
                  Edit Allocation & Rent
                </button>
              </div>

              {/* Owner (Soldier) Details Card */}
              {(() => {
                const owner = soldiers.find((s) => s.id === selectedFlat.ownerId);
                const isUnidentified = !owner || owner.fullName === 'UnIdentified Soldier';

                return (
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-800)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="badge badge-military">SOLDIER ALLOCATION RECORD</span>
                    </div>

                    {!isUnidentified && owner ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-subtle)' }}>Soldier Name:</span>
                          <div style={{ fontWeight: 700 }}>{owner.fullName}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)' }}>Service Number:</span>
                          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{owner.serviceNumber}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)' }}>Landlord Phone:</span>
                          <div style={{ fontWeight: 700, color: 'var(--primary-800)' }}>{owner.phone}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-subtle)' }}>Branch & Rank:</span>
                          <div>{owner.rank} ({owner.militaryBranch})</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span style={{ color: 'var(--text-subtle)' }}>Military Unit:</span>
                          <div style={{ fontWeight: 600 }}>{owner.unitBrigade}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px dashed #CBD5E1', fontSize: '0.825rem', color: 'var(--text-subtle)' }}>
                        <strong>UnIdentified Soldier:</strong> No confirmed landlord assigned yet. SuperAdmin can click "Edit Allocation & Rent" to record officer credentials when available.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sublet Tenant Record & Annual Rent Cycle Widget */}
              {(() => {
                const tenant = tenants.find((t) => t.id === selectedFlat.currentTenantId);
                const isUnconfirmed = !tenant || tenant.fullName === 'Unconfirmed Tenant';
                const rentCycle = tenant ? getRentCycleDetails(tenant.leaseStart, tenant.leaseEnd) : null;

                return (
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#F0F9FF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>
                        Tenant & Annual Rent Cycle
                      </div>
                      {rentCycle && (
                        <span className={`badge ${rentCycle.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                          <Clock size={12} style={{ marginRight: '0.25rem' }} />
                          {rentCycle.badgeLabel}
                        </span>
                      )}
                    </div>

                    {!isUnconfirmed && tenant ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Tenant Name:</span>
                            <div style={{ fontWeight: 700, color: '#0C4A6E' }}>{tenant.fullName}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Phone Contact:</span>
                            <div style={{ fontWeight: 600 }}>{tenant.phone}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Email Address:</span>
                            <div style={{ fontWeight: 600, color: '#0369A1', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{tenant.email}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Annual Rent Paid:</span>
                            <div style={{ fontWeight: 800, color: '#0C4A6E', fontSize: '0.95rem' }}>{formatNaira(tenant.rentAmount || tenant.annualRentAmount || 1200000)} / year</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Rent Start (Move-in):</span>
                            <div style={{ fontWeight: 600 }}>{formatDate(tenant.leaseStart || tenant.rentStartDate || '2026-01-01')}</div>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-subtle)' }}>Rent Expiration / Renewal:</span>
                            <div style={{ fontWeight: 700, color: rentCycle?.isExpiringSoon ? '#D97706' : rentCycle?.isExpired ? '#DC2626' : '#15803D' }}>
                              {formatDate(tenant.leaseEnd || tenant.rentExpiryDate || '2026-12-31')}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar for Annual Cycle */}
                        {rentCycle && (
                          <div style={{ borderTop: '1px solid #BAE6FD', paddingTop: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#0369A1', fontWeight: 600, marginBottom: '0.3rem' }}>
                              <span>Annual Rent Cycle Progress ({rentCycle.cycleLabel})</span>
                              <span>{rentCycle.progressPercent}% Elapsed ({rentCycle.daysRemaining > 0 ? `${rentCycle.daysRemaining} days remaining` : 'Expired'})</span>
                            </div>
                            <div style={{ height: 6, backgroundColor: '#E0F2FE', borderRadius: 99, overflow: 'hidden' }}>
                              <div
                                style={{
                                  height: '100%',
                                  width: `${rentCycle.progressPercent}%`,
                                  backgroundColor: rentCycle.isExpired ? '#DC2626' : rentCycle.isExpiringSoon ? '#D97706' : '#0284C7',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '0.75rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px dashed #BAE6FD', fontSize: '0.825rem', color: '#0369A1' }}>
                        <strong>Unconfirmed Tenant:</strong> No civilian resident currently registered. Unit is tagged as <em>Unoccupied</em> until updated.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedFlat(null)} className="btn btn-primary">
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SuperAdmin Edit Flat Allocation & Rent Modal */}
      {editingFlat && (
        <div className="modal-backdrop" onClick={() => setEditingFlat(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <form onSubmit={handleSaveAllocation}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-100)', color: 'var(--accent-900)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      SuperAdmin Editor: Flat {editingFlat.fullFlatCode}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      Update landlord credentials, resident details, rent dates & annual amounts
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setEditingFlat(null)} className="btn btn-ghost btn-sm">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto' }}>
                {/* SuperAdmin Clearance Badge */}
                <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#92400E' }}>
                  <Lock size={15} />
                  <span><strong>SuperAdmin Controlled:</strong> Rent amounts and annual cycle dates are editable exclusively by SuperAdmin.</span>
                </div>

                {/* Status & Meter Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Occupancy Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as FlatStatus)}
                      className="form-select"
                    >
                      <option value="unoccupied">Unoccupied (Empty)</option>
                      <option value="sublet">Sublet to Tenant</option>
                      <option value="owner_occupied">Owner-Occupied</option>
                      <option value="vacant">Vacant (Available)</option>
                      <option value="under_maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Electricity Meter Number</label>
                    <input
                      type="text"
                      value={editMeter}
                      onChange={(e) => setEditMeter(e.target.value)}
                      className="form-control"
                      placeholder="e.g. ED-UNT-101A"
                    />
                  </div>
                </div>

                {/* Landlord (Soldier) Section */}
                <div style={{ border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#FAF9F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <Shield size={16} color="var(--accent-800)" />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-900)', textTransform: 'uppercase' }}>
                      Soldier Landlord Details (Private to MWO Only)
                    </strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">Landlord Full Name</label>
                      <input
                        type="text"
                        value={editLandlordName}
                        onChange={(e) => setEditLandlordName(e.target.value)}
                        placeholder="Leave blank or enter 'UnIdentified Soldier' if unallocated"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Landlord Phone Number</label>
                      <input
                        type="text"
                        value={editLandlordPhone}
                        onChange={(e) => setEditLandlordPhone(e.target.value)}
                        placeholder="e.g. 0803 123 4567"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Military Rank</label>
                      <select
                        value={editLandlordRank}
                        onChange={(e) => setEditLandlordRank(e.target.value as MilitaryRank)}
                        className="form-select"
                      >
                        {PERMITTED_SOLDIER_RANKS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Military Branch</label>
                      <select
                        value={editLandlordBranch}
                        onChange={(e) => setEditLandlordBranch(e.target.value as MilitaryBranch)}
                        className="form-select"
                      >
                        {MILITARY_BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Service Number</label>
                      <input
                        type="text"
                        value={editLandlordServiceNo}
                        onChange={(e) => setEditLandlordServiceNo(e.target.value)}
                        placeholder="e.g. NA/2012/5819"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Tenant & SuperAdmin Rent Section */}
                <div style={{ border: '1.5px solid #BAE6FD', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: '#F0F9FF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={16} color="#0369A1" />
                      <strong style={{ fontSize: '0.85rem', color: '#0C4A6E', textTransform: 'uppercase' }}>
                        Civilian Tenant & Annual Rent Cycle
                      </strong>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>SuperAdmin Exclusive</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                      <label className="form-label">Tenant Full Name</label>
                      <input
                        type="text"
                        value={editTenantName}
                        onChange={(e) => setEditTenantName(e.target.value)}
                        placeholder="Leave blank or enter 'Unconfirmed Tenant' if empty"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Tenant Email Address</label>
                      <input
                        type="text"
                        value={editTenantEmail}
                        onChange={(e) => setEditTenantEmail(e.target.value)}
                        placeholder="e.g. tenant@gmail.com"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Tenant Phone Number</label>
                      <input
                        type="text"
                        value={editTenantPhone}
                        onChange={(e) => setEditTenantPhone(e.target.value)}
                        placeholder="e.g. 0812 345 6789"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Occupation</label>
                      <input
                        type="text"
                        value={editTenantOccupation}
                        onChange={(e) => setEditTenantOccupation(e.target.value)}
                        placeholder="e.g. Business Owner / Engineer"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Annual Rent Amount Paid (₦)</label>
                      <input
                        type="number"
                        value={editRentAmount}
                        onChange={(e) => setEditRentAmount(Number(e.target.value))}
                        className="form-control"
                        step={50000}
                      />
                    </div>

                    {/* Rent Cycle Date Pickers */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Rent Commenced Date (Start)</label>
                      <input
                        type="date"
                        value={editLeaseStart}
                        onChange={(e) => handleLeaseStartChange(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Rent Expiration / Renewal Date</label>
                      <input
                        type="date"
                        value={editLeaseEnd}
                        onChange={(e) => setEditLeaseEnd(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" onClick={() => setEditingFlat(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Save size={15} />
                  Save Allocation & Rent Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Importer Modal */}
      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onImportComplete={(count) => {
            setNoticeMessage(`Successfully imported ${count} new flat records into ${currentEstate?.name}.`);
            setTimeout(() => setNoticeMessage(null), 4000);
          }}
        />
      )}
    </div>
  );
};
