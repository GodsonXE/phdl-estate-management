import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Flat, FlatStatus } from '../../types';
import { Building, Plus, Edit, Trash2, Search, Filter, CheckCircle2, X, Save } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const FlatManagementPage: React.FC = () => {
    const store = usePhdlStore();
    const currentEstateId = store.getActiveEstateId();
    const flats = store.getFlats(currentEstateId) || [];
    const lanes = store.getLanes(currentEstateId) || [];
    const soldiers = store.getSoldiers() || [];
    const tenants = store.getTenants() || [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLaneId, setSelectedLaneId] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const [editingFlat, setEditingFlat] = useState<Flat | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [laneId, setLaneId] = useState(lanes[0]?.id || '');
    const [houseNumber, setHouseNumber] = useState<number>(1);
    const [flatLetter, setFlatLetter] = useState<'A' | 'B' | 'C' | 'D'>('A');
    const [fullFlatCode, setFullFlatCode] = useState('L1H1A');
    const [status, setStatus] = useState<FlatStatus>('unoccupied');
    const [ownerId, setOwnerId] = useState('');
    const [rentAmount, setRentAmount] = useState(1200000);
    const [notice, setNotice] = useState<string | null>(null);

    const filteredFlats = flats.filter((f) => {
        if (searchQuery.trim()) {
            if (!f.fullFlatCode.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        }
        if (selectedLaneId !== 'all' && f.laneId !== selectedLaneId) return false;
        if (selectedStatus !== 'all' && f.status !== selectedStatus) return false;
        return true;
    });

    const handleOpenCreate = () => {
        setEditingFlat(null);
        setLaneId(lanes[0]?.id || '');
        setHouseNumber(1);
        setFlatLetter('A');
        setFullFlatCode(`L1H${flats.length + 1}A`);
        setStatus('unoccupied');
        setOwnerId('');
        setRentAmount(1200000);
        setIsCreating(true);
    };

    const handleOpenEdit = (f: Flat) => {
        setIsCreating(false);
        setEditingFlat(f);
        setLaneId(f.laneId);
        setHouseNumber(f.houseNumber || 1);
        setFlatLetter(((f.flatLetter as 'A' | 'B' | 'C' | 'D') || 'A'));
        setFullFlatCode(f.fullFlatCode);
        setStatus(f.status);
        setOwnerId(f.ownerId || '');
        setRentAmount(f.rentAmount || 1200000);
    };

    const handleSaveFlat = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreating) {
            const newFlat: Flat = {
                id: fullFlatCode,
                estateId: currentEstateId,
                laneId,
                houseNumber: Number(houseNumber),
                flatLetter,
                fullFlatCode,
                flatType: '2-Bedroom Standard',
                status,
                ownerId: ownerId || undefined,
                rentAmount: Number(rentAmount),
            };
            store.addFlat(newFlat);
            setNotice(`✓ Added Housing Unit: Flat ${newFlat.fullFlatCode}`);
        } else if (editingFlat) {
            const updated: Flat = {
                ...editingFlat,
                laneId,
                houseNumber: Number(houseNumber),
                flatLetter,
                fullFlatCode,
                status,
                ownerId: ownerId || undefined,
                rentAmount: Number(rentAmount),
            };
            store.updateFlat(updated);
            setNotice(`✓ Updated Flat ${updated.fullFlatCode}`);
        }

        setIsCreating(false);
        setEditingFlat(null);
        setTimeout(() => setNotice(null), 3000);
    };

    const handleDelete = (id: string, code: string) => {
        if (window.confirm(`Delete Flat ${code} from housing registry?`)) {
            store.deleteFlat(id);
            setNotice(`✓ Deleted Flat ${code}`);
            setTimeout(() => setNotice(null), 3000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-overline">
                        <span>SUPERADMIN HOUSING CONTROL</span> • <span>{flats.length} 2-BEDROOM UNITS</span>
                    </div>
                    <h1>Estate Flats & Allocation Management</h1>
                    <p>Create new apartment units, reassign soldier allocations, and manage residential occupancy.</p>
                </div>

                <button onClick={handleOpenCreate} className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}>
                    <Plus size={16} /> Create New Flat
                </button>
            </div>

            {notice && (
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                    {notice}
                </div>
            )}

            {/* Filter Bar */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label"><Search size={14} style={{ display: 'inline', marginRight: 4 }} /> Search Code:</label>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="e.g. L1H1A" className="form-control" />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label"><Building size={14} style={{ display: 'inline', marginRight: 4 }} /> Lane:</label>
                        <select value={selectedLaneId} onChange={(e) => setSelectedLaneId(e.target.value)} className="form-select">
                            <option value="all">-- All Lanes --</option>
                            {lanes.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label"><Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Status:</label>
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select">
                            <option value="all">-- All Statuses --</option>
                            <option value="occupied">Occupied (Sublet)</option>
                            <option value="owner_occupied">Owner Occupied</option>
                            <option value="unoccupied">Unoccupied</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Flats Table */}
            <div className="card">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Flat Code</th>
                                <th>Lane</th>
                                <th>Apartment Type</th>
                                <th>Soldier Owner</th>
                                <th>Current Tenant</th>
                                <th>Occupancy Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFlats.map((f) => {
                                const lane = lanes.find((l) => l.id === f.laneId);
                                const owner = soldiers.find((s) => s.id === f.ownerId || (s.ownedFlatIds || []).includes(f.id));
                                const tenant = tenants.find((t) => t.id === f.currentTenantId || t.flatId === f.id);

                                return (
                                    <tr key={f.id}>
                                        <td><strong>Flat {f.fullFlatCode}</strong></td>
                                        <td>{lane?.name || 'Lane 1'}</td>
                                        <td>2-Bedroom Standard</td>
                                        <td>{owner ? `${owner.rank} ${owner.fullName}` : <span style={{ color: 'var(--text-subtle)' }}>PHDL Pool</span>}</td>
                                        <td>{tenant ? tenant.fullName : <span style={{ color: 'var(--text-subtle)' }}>—</span>}</td>
                                        <td>
                                            <span className={`badge ${f.status === 'occupied' ? 'badge-success' : f.status === 'owner_occupied' ? 'badge-military' : 'badge-warning'}`}>
                                                {f.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                <button onClick={() => handleOpenEdit(f)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                                                    <Edit size={13} />
                                                </button>
                                                <button onClick={() => handleDelete(f.id, f.fullFlatCode)} className="btn btn-ghost btn-sm" style={{ color: 'var(--army-red-700)', padding: '4px 8px' }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Flat Create / Edit Modal */}
            {(isCreating || editingFlat) && (
                <div className="modal-backdrop" onClick={() => { setIsCreating(false); setEditingFlat(null); }}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{isCreating ? 'Create New Flat Unit' : `Modify Flat ${editingFlat?.fullFlatCode}`}</h3>
                            <button onClick={() => { setIsCreating(false); setEditingFlat(null); }} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveFlat}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Lane</label>
                                        <select value={laneId} onChange={(e) => setLaneId(e.target.value)} className="form-select">
                                            {lanes.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Flat Code (e.g. L1H4A)</label>
                                        <input type="text" value={fullFlatCode} onChange={(e) => setFullFlatCode(e.target.value)} className="form-control" required />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">House Number</label>
                                        <input type="number" value={houseNumber} onChange={(e) => setHouseNumber(Number(e.target.value))} className="form-control" min={1} required />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Flat Letter (A/B/C/D)</label>
                                        <select value={flatLetter} onChange={(e) => setFlatLetter(e.target.value as any)} className="form-select">
                                            <option value="A">A (Ground Left)</option>
                                            <option value="B">B (Ground Right)</option>
                                            <option value="C">C (Upper Left)</option>
                                            <option value="D">D (Upper Right)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Allocated Soldier Owner</label>
                                    <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className="form-select">
                                        <option value="">-- None (PHDL Pool) --</option>
                                        {soldiers.map((s) => (
                                            <option key={s.id} value={s.id}>{s.rank} {s.fullName} ({s.militaryBranch})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Occupancy Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="form-select">
                                        <option value="occupied">Occupied (Sublet to Tenant)</option>
                                        <option value="owner_occupied">Owner Occupied</option>
                                        <option value="unoccupied">Unoccupied</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" onClick={() => { setIsCreating(false); setEditingFlat(null); }} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--army-green-800)' }}>
                                    <Save size={15} /> Save Flat
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};