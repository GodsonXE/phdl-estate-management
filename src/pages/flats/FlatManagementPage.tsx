import React, { useState, useEffect, useRef } from 'react';
import {
  Building,
  Building2,
  Search,
  Filter,
  Download,
  Upload,
  Edit3,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  X,
  Save,
  Users,
  RotateCcw,
} from 'lucide-react';

export interface FlatRecord {
  id: string;
  flatCode: string;
  laneNumber: number;
  houseNumber: number;
  flatPosition: 'A' | 'B' | 'C' | 'D';
  apartmentType: string;
  soldierOwner: string;
  serviceNo: string;
  currentTenant: string;
  tenantPhone: string;
  occupancyStatus: 'owner_occupied' | 'sublet_tenant' | 'unoccupied' | 'maintenance';
  meterNumber: string;
  serviceCharge: 'Paid' | 'Pending';
}

// Master generator for the exact 400 flats (100 Houses across 8 Lanes)
export const generateOfficial400Flats = (): FlatRecord[] => {
  const result: FlatRecord[] = [];
  const laneHouses: { [key: number]: number } = {
    1: 9,
    2: 17,
    3: 18,
    4: 18,
    5: 16,
    6: 8,
    7: 7,
    8: 7,
  };

  const ranks = ['Staff Sgt.', 'Captain', 'Major', 'Lt. Col.', 'Warrant Officer', 'Master Warrant Officer', 'Corporal', 'Sergeant'];
  const firstNames = ['Adamu', 'Farouk', 'Emeka', 'Tunde', 'Ibrahim', 'Chukwuma', 'Musa', 'Babatunde', 'Sunday', 'Usman', 'Gideon', 'Yakubu'];
  const lastNames = ['Mohammed', 'Danjuma', 'Okon', 'Adeyemi', 'Bello', 'Eze', 'Abubakar', 'Balogun', 'Okafor', 'Garba', 'Nwosu', 'Aliyu'];

  for (let lane = 1; lane <= 8; lane++) {
    const maxHouse = laneHouses[lane];
    for (let h = 1; h <= maxHouse; h++) {
      const positions: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

      positions.forEach((pos, posIdx) => {
        const flatCode = `L${lane}H${h}${pos}`;
        const seed = lane * 100 + h * 4 + posIdx;

        let status: FlatRecord['occupancyStatus'] = 'owner_occupied';
        if (seed % 9 === 0 || seed % 14 === 0) status = 'sublet_tenant';
        else if (seed % 19 === 0) status = 'unoccupied';
        else if (seed % 31 === 0) status = 'maintenance';

        const r = ranks[seed % ranks.length];
        const fn = firstNames[seed % firstNames.length];
        const ln = lastNames[seed % lastNames.length];
        const soldier = `${r} ${fn} ${ln}`;
        const srvNo = `NA/${1000 + (seed * 17) % 8999}/ARMY`;
        const tenant = status === 'sublet_tenant' ? `Engr. ${firstNames[(seed + 3) % firstNames.length]} ${lastNames[(seed + 2) % lastNames.length]}` : '';

        result.push({
          id: `flat-${flatCode.toLowerCase()}`,
          flatCode,
          laneNumber: lane,
          houseNumber: h,
          flatPosition: pos,
          apartmentType: '3-Bedroom Luxury Flat',
          soldierOwner: status !== 'unoccupied' ? soldier : 'Unallocated',
          serviceNo: status !== 'unoccupied' ? srvNo : 'N/A',
          currentTenant: status === 'sublet_tenant' ? tenant : (status === 'owner_occupied' ? soldier : 'None'),
          tenantPhone: `+234 80${(seed % 9) + 1} ${(100 + seed * 3) % 900} ${(2000 + seed * 7) % 9000}`,
          occupancyStatus: status,
          meterNumber: `MTR-PHDL-${1000 + seed}`,
          serviceCharge: seed % 2 === 0 ? 'Paid' : 'Pending',
        });
      });
    }
  }
  return result;
};

export const FlatManagementPage: React.FC = () => {
  const [flats, setFlats] = useState<FlatRecord[]>(() => {
    localStorage.removeItem('phdl_flats');
    localStorage.removeItem('phdl_estate_flats');
    localStorage.removeItem('phdl_flats_v7');
    localStorage.removeItem('phdl_flats_v8');
    localStorage.removeItem('phdl_404_flats_v9');
    localStorage.removeItem('phdl_master_404_flats_v10');
    localStorage.removeItem('phdl_master_flats_v11');

    const saved = localStorage.getItem('phdl_new_400_flats_v12');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 400) return parsed;
      } catch (e) { /* fallback */ }
    }
    const fresh = generateOfficial400Flats();
    localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(fresh));
    return fresh;
  });

  const [searchCode, setSearchCode] = useState('');
  const [selectedLane, setSelectedLane] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingFlat, setEditingFlat] = useState<FlatRecord | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Flat State
  const [newCode, setNewCode] = useState('');
  const [newLane, setNewLane] = useState(1);
  const [newHouse, setNewHouse] = useState(1);
  const [newSoldier, setNewSoldier] = useState('');
  const [newSrv, setNewSrv] = useState('');

  const handleResetDirectory = () => {
    const fresh = generateOfficial400Flats();
    setFlats(fresh);
    localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(fresh));
    setSuccessNotice('Official Estate Directory reloaded with all 400 flats (100 houses across 8 lanes)!');
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlat) return;

    const updated = flats.map((f) => (f.id === editingFlat.id ? editingFlat : f));
    setFlats(updated);
    localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(updated));
    setEditingFlat(null);
    setSuccessNotice(`Flat ${editingFlat.flatCode} modified successfully!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleCreateFlat = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FlatRecord = {
      id: `flat-${newCode.toLowerCase().replace(/\s+/g, '')}`,
      flatCode: newCode.toUpperCase(),
      laneNumber: newLane,
      houseNumber: newHouse,
      flatPosition: 'A',
      apartmentType: '3-Bedroom Luxury Flat',
      soldierOwner: newSoldier || 'Unallocated',
      serviceNo: newSrv || 'N/A',
      currentTenant: newSoldier || 'None',
      tenantPhone: '+234 803 000 0000',
      occupancyStatus: newSoldier ? 'owner_occupied' : 'unoccupied',
      meterNumber: `MTR-PHDL-${Date.now().toString().slice(-4)}`,
      serviceCharge: 'Paid',
    };

    const updated = [created, ...flats];
    setFlats(updated);
    localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(updated));
    setIsCreatingNew(false);
    setSuccessNotice(`New Flat ${created.flatCode} added to estate inventory!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // CSV IMPORT
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const imported: FlatRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4) {
          imported.push({
            id: `flat-${parts[0].replace(/"/g, '').trim().toLowerCase()}`,
            flatCode: parts[0].replace(/"/g, '').trim(),
            laneNumber: Number(parts[1]) || 1,
            houseNumber: Number(parts[2]) || 1,
            flatPosition: 'A',
            apartmentType: parts[3]?.replace(/"/g, '').trim() || '3-Bedroom Luxury Flat',
            soldierOwner: parts[4]?.replace(/"/g, '').trim() || 'Unallocated',
            serviceNo: parts[5]?.replace(/"/g, '').trim() || 'N/A',
            currentTenant: parts[6]?.replace(/"/g, '').trim() || 'None',
            tenantPhone: '+234 800 000 0000',
            occupancyStatus: (parts[7]?.replace(/"/g, '').trim() as any) || 'owner_occupied',
            meterNumber: `MTR-PHDL-${1000 + i}`,
            serviceCharge: 'Paid',
          });
        }
      }

      if (imported.length > 0) {
        setFlats(imported);
        localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(imported));
        setSuccessNotice(`✅ Imported ${imported.length} apartment records from CSV!`);
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  // CSV EXPORT
  const handleExportCSV = () => {
    const headers = ['Flat Code', 'Lane', 'House', 'Apartment Type', 'Soldier Owner', 'Service No', 'Current Tenant', 'Occupancy Status', 'Meter ID', 'Service Charge'];
    const rows = filteredFlats.map((f) => [
      f.flatCode,
      f.laneNumber,
      f.houseNumber,
      `"${f.apartmentType}"`,
      `"${f.soldierOwner}"`,
      f.serviceNo,
      `"${f.currentTenant}"`,
      f.occupancyStatus,
      f.meterNumber,
      f.serviceCharge,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PHDL_Unity_Estate_400_Flats_Directory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFlats = flats.filter((f) => {
    if (searchCode.trim()) {
      const q = searchCode.toLowerCase();
      const mCode = f.flatCode.toLowerCase().includes(q);
      const mSoldier = f.soldierOwner.toLowerCase().includes(q);
      const mTenant = f.currentTenant.toLowerCase().includes(q);
      const mSrv = f.serviceNo.toLowerCase().includes(q);
      if (!mCode && !mSoldier && !mTenant && !mSrv) return false;
    }
    if (selectedLane !== 'all' && f.laneNumber.toString() !== selectedLane) return false;
    if (selectedStatus !== 'all' && f.occupancyStatus !== selectedStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>SUPERADMIN HOUSING CONTROL</span> • <span>{filteredFlats.length} OF {flats.length} FLATS DISPLAYED</span>
          </div>
          <h1>Estate Flats & Allocation Management</h1>
          <p>
            Official Directory of all <strong>400 residential flats (100 Houses across 8 Lanes)</strong>. Admins can modify allottees, reassign tenancies, and import/export estate spreadsheets.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetDirectory}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.4rem', color: '#991B1B', borderColor: '#991B1B' }}
          >
            <RotateCcw size={14} /> Reload 400 Directory
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem', backgroundColor: '#15803D', color: '#FFFFFF', fontWeight: 800 }}
          >
            <Upload size={14} /> Import Flats (CSV)
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-outline btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Download size={14} /> Export CSV ({filteredFlats.length})
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem', backgroundColor: '#991B1B', color: '#FFFFFF', fontWeight: 800 }}
          >
            <Plus size={14} /> Create New Flat
          </button>
        </div>
      </div>

      {successNotice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {successNotice}
        </div>
      )}

      {/* Filter Bar with Accurate Lane Counts */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Search size={14} style={{ display: 'inline', marginRight: 4 }} /> Search Flat Code, Soldier Name, or Service No:
            </label>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. L1H1A, L2H17D, Adamu, NA/4521..."
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Building size={14} style={{ display: 'inline', marginRight: 4 }} /> Lane (100 Houses • 400 Flats):
            </label>
            <select value={selectedLane} onChange={(e) => setSelectedLane(e.target.value)} className="form-select">
              <option value="all">-- All 8 Lanes (400 Flats) --</option>
              <option value="1">Lane 1 (9 Houses • 36 Flats: L1H1 to L1H9)</option>
              <option value="2">Lane 2 (17 Houses • 68 Flats: L2H1 to L2H17)</option>
              <option value="3">Lane 3 (18 Houses • 72 Flats: L3H1 to L3H18)</option>
              <option value="4">Lane 4 (18 Houses • 72 Flats: L4H1 to L4H18)</option>
              <option value="5">Lane 5 (16 Houses • 64 Flats: L5H1 to L5H16)</option>
              <option value="6">Lane 6 (8 Houses • 32 Flats: L6H1 to L6H8)</option>
              <option value="7">Lane 7 (7 Houses • 28 Flats: L7H1 to L7H7)</option>
              <option value="8">Lane 8 (7 Houses • 28 Flats: L8H1 to L8H7)</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Occupancy Status:
            </label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select">
              <option value="all">-- All Statuses --</option>
              <option value="owner_occupied">Owner Occupied (Soldier)</option>
              <option value="sublet_tenant">Occupied (Sublet Tenant)</option>
              <option value="unoccupied">Unoccupied / Available</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* 400 FLATS DATA TABLE */}
      <div className="card">
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--army-green-950)' }}>
            Estate Flat Inventory ({filteredFlats.length} Flats Loaded)
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click "Modify Flat" to edit any apartment or allottee
          </span>
        </div>

        <div className="table-container" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Flat Code</th>
                <th>Lane & House</th>
                <th>Apartment Type</th>
                <th>Soldier Owner</th>
                <th>Current Tenant</th>
                <th>Occupancy Status</th>
                <th>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlats.map((flat) => {
                return (
                  <tr key={flat.id}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--army-green-950)' }}>
                          Flat {flat.flatCode}
                        </strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Position {flat.flatPosition}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--army-green-900)' }}>
                        Lane {flat.laneNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        House {flat.houseNumber}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: 'var(--army-green-950)' }}>
                        {flat.apartmentType}
                      </div>
                    </td>
                    <td>
                      {flat.soldierOwner !== 'Unallocated' ? (
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--army-green-950)' }}>
                            {flat.soldierOwner}
                          </strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {flat.serviceNo}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontStyle: 'italic' }}>Unallocated</span>
                      )}
                    </td>
                    <td>
                      {flat.currentTenant !== 'None' ? (
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1E293B' }}>
                          {flat.currentTenant}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Vacant</span>
                      )}
                    </td>
                    <td>
                      {flat.occupancyStatus === 'owner_occupied' && (
                        <span className="badge badge-success">🪖 Owner Occupied</span>
                      )}
                      {flat.occupancyStatus === 'sublet_tenant' && (
                        <span className="badge" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                          🏠 Sublet Tenant
                        </span>
                      )}
                      {flat.occupancyStatus === 'unoccupied' && (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          🏢 Unoccupied
                        </span>
                      )}
                      {flat.occupancyStatus === 'maintenance' && (
                        <span className="badge badge-danger">⚠️ Maintenance</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEditingFlat({ ...flat })}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', gap: '0.3rem', backgroundColor: '#1B4D21' }}
                      >
                        <Edit3 size={12} /> Modify Flat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODIFY FLAT MODAL */}
      {editingFlat && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Modify Flat Information: {editingFlat.flatCode}</h3>
              <button type="button" onClick={() => setEditingFlat(null)} className="btn btn-outline btn-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Flat Code:</label>
                  <input
                    type="text"
                    value={editingFlat.flatCode}
                    onChange={(e) => setEditingFlat({ ...editingFlat, flatCode: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Occupancy Status:</label>
                  <select
                    value={editingFlat.occupancyStatus}
                    onChange={(e) => setEditingFlat({ ...editingFlat, occupancyStatus: e.target.value as any })}
                    className="form-select"
                  >
                    <option value="owner_occupied">Owner Occupied (Soldier)</option>
                    <option value="sublet_tenant">Occupied (Sublet Tenant)</option>
                    <option value="unoccupied">Unoccupied / Available</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--army-green-950)' }}>🪖 Soldier Owner Details:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Soldier Rank & Full Name:</label>
                    <input
                      type="text"
                      value={editingFlat.soldierOwner}
                      onChange={(e) => setEditingFlat({ ...editingFlat, soldierOwner: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Military Service Number:</label>
                    <input
                      type="text"
                      value={editingFlat.serviceNo}
                      onChange={(e) => setEditingFlat({ ...editingFlat, serviceNo: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                <strong style={{ fontSize: '0.82rem', color: '#1E40AF' }}>🏠 Current Resident / Tenant:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    value={editingFlat.currentTenant}
                    onChange={(e) => setEditingFlat({ ...editingFlat, currentTenant: e.target.value })}
                    placeholder="Tenant Name"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingFlat(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem', backgroundColor: '#1B4D21' }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW FLAT MODAL */}
      {isCreatingNew && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Create New Apartment Unit</h3>
              <button type="button" onClick={() => setIsCreatingNew(false)} className="btn btn-outline btn-sm">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateFlat} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Flat Code (e.g. L9H1A):</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="L9H1A"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Lane Number:</label>
                  <input
                    type="number"
                    value={newLane}
                    onChange={(e) => setNewLane(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">House Number:</label>
                  <input
                    type="number"
                    value={newHouse}
                    onChange={(e) => setNewHouse(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Assign Soldier Owner (Optional):</label>
                <input
                  type="text"
                  value={newSoldier}
                  onChange={(e) => setNewSoldier(e.target.value)}
                  placeholder="e.g. Captain Farouk Bello"
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Military Service Number (Optional):</label>
                <input
                  type="text"
                  value={newSrv}
                  onChange={(e) => setNewSrv(e.target.value)}
                  placeholder="e.g. NA/4421/ARMY"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCreatingNew(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem', backgroundColor: '#991B1B' }}>
                  <Plus size={14} /> Provision Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlatManagementPage;