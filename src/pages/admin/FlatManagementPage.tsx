import React, { useState, useRef } from 'react';
import { usePhdlStore, EstateFlat } from '../../data/storage';
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
  RotateCcw,
  Save,
} from 'lucide-react';

export const FlatManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const [flats, setFlats] = useState<EstateFlat[]>(store.getFlats());
  const [searchCode, setSearchCode] = useState('');
  const [selectedLane, setSelectedLane] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingFlat, setEditingFlat] = useState<EstateFlat | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlat) return;
    const updated = flats.map((f) => (f.id === editingFlat.id ? editingFlat : f));
    setFlats(updated);
    store.saveFlats(updated);
    setEditingFlat(null);
    setSuccessNotice(`Flat ${editingFlat.flatCode} modified successfully!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const imported: EstateFlat[] = [];
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
        store.saveFlats(imported);
        setSuccessNotice(`✅ Imported ${imported.length} apartment records from CSV!`);
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    };
    reader.readAsText(file);
  };

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

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input type="file" ref={fileInputRef} onChange={handleCSVUpload} accept=".csv" style={{ display: 'none' }} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-sm" style={{ gap: '0.4rem', backgroundColor: '#15803D' }}>
            <Upload size={14} /> Import Flats (CSV)
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}><Download size={14} /> Export PDF Report</button><button type="button" onClick={handleExportCSV} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Download size={14} /> Export CSV ({filteredFlats.length})
          </button>
        </div>
      </div>

      {successNotice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> {successNotice}
        </div>
      )}

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label"><Search size={14} style={{ display: 'inline', marginRight: 4 }} /> Search Flat Code, Soldier Name, or Service No:</label>
            <input type="text" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} placeholder="e.g. L1H1A, L2H17D, Adamu, NA/4521..." className="form-control" />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label"><Building size={14} style={{ display: 'inline', marginRight: 4 }} /> Lane (100 Houses • 400 Flats):</label>
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
            <label className="form-label"><Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Occupancy Status:</label>
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

      <div className="card">
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
              {filteredFlats.map((flat) => (
                <tr key={flat.id}>
                  <td><strong>Flat {flat.flatCode}</strong></td>
                  <td><strong>Lane {flat.laneNumber}</strong> (House {flat.houseNumber})</td>
                  <td>{flat.apartmentType}</td>
                  <td>
                    {flat.soldierOwner !== 'Unallocated' ? (
                      <div><strong>{flat.soldierOwner}</strong><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{flat.serviceNo}</div></div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Unallocated</span>
                    )}
                  </td>
                  <td>{flat.currentTenant !== 'None' ? flat.currentTenant : <span style={{ color: '#9CA3AF' }}>Vacant</span>}</td>
                  <td>
                    <span className={`badge ${flat.occupancyStatus === 'owner_occupied' ? 'badge-success' : flat.occupancyStatus === 'sublet_tenant' ? 'badge-military' : flat.occupancyStatus === 'unoccupied' ? 'badge-warning' : 'badge-danger'}`}>
                      {flat.occupancyStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setEditingFlat({ ...flat })} className="btn btn-primary btn-sm" style={{ fontSize: '0.72rem', gap: '0.3rem', backgroundColor: '#1B4D21' }}>
                      <Edit3 size={12} /> Modify Flat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingFlat && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Modify Flat: {editingFlat.flatCode}</h3>
              <button onClick={() => setEditingFlat(null)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Soldier Owner Name & Rank:</label>
                <input type="text" value={editingFlat.soldierOwner} onChange={(e) => setEditingFlat({ ...editingFlat, soldierOwner: e.target.value })} className="form-control" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Military Service Number:</label>
                <input type="text" value={editingFlat.serviceNo} onChange={(e) => setEditingFlat({ ...editingFlat, serviceNo: e.target.value })} className="form-control" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Current Resident / Sublet Tenant:</label>
                <input type="text" value={editingFlat.currentTenant} onChange={(e) => setEditingFlat({ ...editingFlat, currentTenant: e.target.value })} className="form-control" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setEditingFlat(null)} className="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#1B4D21', gap: '0.4rem' }}>
                  <Save size={14} /> Save Changes
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