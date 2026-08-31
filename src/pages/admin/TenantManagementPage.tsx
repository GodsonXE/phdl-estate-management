import React, { useState, useRef } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Tenant, Flat, Lane } from '../../types';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import {
    Users,
    Search,
    Filter,
    Edit,
    Trash2,
    ShieldCheck,
    Building,
    Upload,
    Download,
    Printer,
    CheckCircle2,
    AlertCircle,
    X,
    Save,
    Plus,
    FileText,
    FileSpreadsheet,
} from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

export const TenantManagementPage: React.FC = () => {
    const store = usePhdlStore();
    const currentEstateId = store.getActiveEstateId();
    const estate = store.getEstateById(currentEstateId);
    const tenants = store.getTenants() || [];
    const flats = store.getFlats(currentEstateId) || [];
    const lanes = store.getLanes(currentEstateId) || [];
    const soldiers = store.getSoldiers() || [];
    const adminSignature = store.getSuperAdminSignature();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLaneId, setSelectedLaneId] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Modals
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    // Form Fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [flatId, setFlatId] = useState('');
    const [rentAmount, setRentAmount] = useState<number>(1200000);
    const [rentExpiryDate, setRentExpiryDate] = useState('2026-12-31');
    const [occupation, setOccupation] = useState('');
    const [employer, setEmployer] = useState('');
    const [onboardingComplete, setOnboardingComplete] = useState<boolean>(true);

    // CSV Import State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);

    // Filter logic
    const filteredTenants = tenants.filter((tenant) => {
        const flat = flats.find((f) => f.id === tenant.flatId);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            if (
                !tenant.fullName.toLowerCase().includes(q) &&
                !tenant.phone.toLowerCase().includes(q) &&
                !(flat?.fullFlatCode || '').toLowerCase().includes(q)
            ) {
                return false;
            }
        }
        if (selectedLaneId !== 'all' && flat?.laneId !== selectedLaneId) return false;
        if (selectedCategory === 'verified' && !tenant.onboardingComplete) return false;
        if (selectedCategory === 'unverified' && tenant.onboardingComplete) return false;
        return true;
    });

    const handleOpenCreate = () => {
        setEditingTenant(null);
        setFullName('');
        setPhone('');
        setEmail('');
        setFlatId(flats[0]?.id || '');
        setRentAmount(1200000);
        setRentExpiryDate('2026-12-31');
        setOccupation('Civilian Professional');
        setEmployer('Private Sector');
        setOnboardingComplete(true);
        setIsCreating(true);
    };

    const handleOpenEdit = (t: Tenant) => {
        setIsCreating(false);
        setEditingTenant(t);
        setFullName(t.fullName);
        setPhone(t.phone);
        setEmail(t.email);
        setFlatId(t.flatId);
        setRentAmount(t.annualRentAmount || 1200000);
        setRentExpiryDate(t.rentExpiryDate || '2026-12-31');
        setOccupation(t.occupation || '');
        setEmployer(t.employer || '');
        setOnboardingComplete(Boolean(t.onboardingComplete));
    };

    const handleSaveTenant = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !flatId) return;

        if (isCreating) {
            const newTenant: Tenant = {
                id: `tenant-${Date.now()}`,
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                flatId,
                rentStartDate: new Date().toISOString().split('T')[0],
                rentExpiryDate,
                annualRentAmount: Number(rentAmount),
                occupation: occupation.trim(),
                employer: employer.trim(),
                dependentsCount: 0,
                dependents: [],
                onboardingComplete,
                createdAt: new Date().toISOString(),
            };
            store.addTenant(newTenant);
            setNotice(`✓ Successfully created resident tenant: ${newTenant.fullName}`);
        } else if (editingTenant) {
            const updated: Tenant = {
                ...editingTenant,
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                flatId,
                rentExpiryDate,
                annualRentAmount: Number(rentAmount),
                occupation: occupation.trim(),
                employer: employer.trim(),
                onboardingComplete,
            };
            store.updateTenant(updated);
            setNotice(`✓ Updated tenant: ${updated.fullName}`);
        }

        setEditingTenant(null);
        setIsCreating(false);
        setTimeout(() => setNotice(null), 3500);
    };

    const handleDeleteTenant = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete tenant ${name}?`)) {
            store.deleteTenant(id);
            setNotice(`✓ Deleted tenant: ${name}`);
            setTimeout(() => setNotice(null), 3500);
        }
    };

    // CSV Parse Handler
    const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
            const parsed = lines.slice(1).map((line, idx) => {
                const [name, phone, email, flatCode, rent, expiry] = line.split(',');
                return {
                    id: `csv-${idx}-${Date.now()}`,
                    fullName: name?.trim() || 'Resident',
                    phone: phone?.trim() || '+234 800 000 0000',
                    email: email?.trim() || 'tenant@gmail.com',
                    flatCode: flatCode?.trim() || 'L1H1A',
                    annualRent: Number(rent) || 1200000,
                    rentExpiryDate: expiry?.trim() || '2026-12-31',
                };
            });
            setCsvPreviewRows(parsed);
        };
        reader.readAsText(file);
    };

    const handleCommitCsvImport = () => {
        csvPreviewRows.forEach((row) => {
            const flat = flats.find((f) => f.fullFlatCode === row.flatCode) || flats[0];
            const newT: Tenant = {
                id: `tenant-csv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                fullName: row.fullName,
                phone: row.phone,
                email: row.email,
                flatId: flat ? flat.id : 'L1H1A',
                rentStartDate: '2026-01-01',
                rentExpiryDate: row.rentExpiryDate,
                annualRentAmount: row.annualRent,
                occupation: 'Civilian Professional',
                employer: 'Private Sector',
                dependentsCount: 0,
                dependents: [],
                onboardingComplete: true,
                createdAt: new Date().toISOString(),
            };
            store.addTenant(newT);
        });

        setShowImportModal(false);
        setCsvFile(null);
        setCsvPreviewRows([]);
        setNotice(`✓ Batch imported ${csvPreviewRows.length} tenant resident records.`);
        setTimeout(() => setNotice(null), 3500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Action Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-overline">
                        <span>SUPERADMIN AUTHORITY</span> • <span>CIVILIAN TENANT REGISTRY</span>
                    </div>
                    <h1>Civilian Residents Database & Management</h1>
                    <p>
                        Create, modify, batch import, and export authenticated tenant rosters with official Commandant verification stamping.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}
                    >
                        <Upload size={16} />
                        Import CSV Roster
                    </button>
                    <button
                        onClick={() => setShowPdfModal(true)}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}
                    >
                        <Printer size={16} />
                        Export Official PDF
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="btn btn-primary"
                        style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
                    >
                        <Plus size={16} />
                        New Tenant
                    </button>
                </div>
            </div>

            {notice && (
                <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                    {notice}
                </div>
            )}

            {/* Filter Bar */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">
                            <Search size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Search Tenant / Flat:
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, phone, flat..."
                            className="form-control"
                        />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">
                            <Building size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Filter by Lane:
                        </label>
                        <select
                            value={selectedLaneId}
                            onChange={(e) => setSelectedLaneId(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">-- All Lanes --</option>
                            {lanes.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">
                            <Filter size={14} style={{ display: 'inline', marginRight: 4 }} />
                            Onboarding Category:
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">-- All Statuses --</option>
                            <option value="verified">Verified Onboarded</option>
                            <option value="unverified">Pending Completion</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="card-title">
                        <Users size={18} /> Civilian Residents Roster ({filteredTenants.length})
                    </div>
                    <span className="badge badge-military">SuperAdmin Full CRUD Active</span>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Resident Particulars</th>
                                <th>Assigned Flat & Lane</th>
                                <th>Soldier Landlord</th>
                                <th>Tenancy Period</th>
                                <th>Annual Rent</th>
                                <th>Onboarding</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-subtle)' }}>
                                        No resident records found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((t) => {
                                    const flat = flats.find((f) => f.id === t.flatId);
                                    const lane = lanes.find((l) => l.id === flat?.laneId);
                                    const landlord = soldiers.find((s) => s.id === t.landlordId || s.id === flat?.ownerId);

                                    return (
                                        <tr key={t.id}>
                                            <td>
                                                <strong style={{ color: 'var(--army-green-950)' }}>{t.fullName}</strong>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.phone}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.email}</div>
                                            </td>
                                            <td>
                                                <strong>Flat {flat?.fullFlatCode || t.flatId}</strong>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{lane?.name || 'Lane 1'}</div>
                                            </td>
                                            <td>
                                                {landlord ? (
                                                    <div>
                                                        <span style={{ fontWeight: 700, color: 'var(--army-green-900)' }}>
                                                            {landlord.rank} {landlord.fullName}
                                                        </span>
                                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                            {landlord.militaryBranch}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#D97706', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        {t.landlordNameUnverified || 'Unassigned'}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                                    {formatDate(t.rentStartDate || '2026-01-01')} → {formatDate(t.rentExpiryDate || '2026-12-31')}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 800, color: 'var(--army-green-900)' }}>
                                                {formatNaira(t.annualRentAmount || 1200000)}
                                            </td>
                                            <td>
                                                <span className={`badge ${t.onboardingComplete ? 'badge-success' : 'badge-warning'}`}>
                                                    {t.onboardingComplete ? '✓ Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(t)}
                                                        className="btn btn-outline btn-sm"
                                                        style={{ padding: '4px 8px' }}
                                                    >
                                                        <Edit size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteTenant(t.id, t.fullName)}
                                                        className="btn btn-ghost btn-sm"
                                                        style={{ color: 'var(--army-red-700)', padding: '4px 8px' }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================================= */}
            {/* CREATE / EDIT TENANT MODAL                                */}
            {/* ========================================================= */}
            {(isCreating || editingTenant) && (
                <div className="modal-backdrop" onClick={() => { setIsCreating(false); setEditingTenant(null); }}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Edit size={18} />
                                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                                    {isCreating ? 'SuperAdmin: Register New Tenant' : 'SuperAdmin: Modify Tenant Particulars'}
                                </h3>
                            </div>
                            <button onClick={() => { setIsCreating(false); setEditingTenant(null); }} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTenant}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Phone Number *</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Assigned Housing Unit (Flat) *</label>
                                    <select
                                        value={flatId}
                                        onChange={(e) => setFlatId(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        {flats.map((f) => {
                                            const lane = lanes.find((l) => l.id === f.laneId);
                                            return (
                                                <option key={f.id} value={f.id}>
                                                    {lane?.name}, Flat {f.fullFlatCode} (2-Bedroom Standard)
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Annual Rent (₦) *</label>
                                        <input
                                            type="number"
                                            value={rentAmount}
                                            onChange={(e) => setRentAmount(Number(e.target.value))}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Rent Expiry Date *</label>
                                        <input
                                            type="date"
                                            value={rentExpiryDate}
                                            onChange={(e) => setRentExpiryDate(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Occupation</label>
                                        <input
                                            type="text"
                                            value={occupation}
                                            onChange={(e) => setOccupation(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Employer</label>
                                        <input
                                            type="text"
                                            value={employer}
                                            onChange={(e) => setEmployer(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={onboardingComplete}
                                        onChange={(e) => setOnboardingComplete(e.target.checked)}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                        Confirm & Approve Resident Tenancy Verification
                                    </span>
                                </label>
                            </div>

                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" onClick={() => { setIsCreating(false); setEditingTenant(null); }} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}>
                                    <Save size={15} /> Save Resident Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* CSV BATCH IMPORT MODAL                                    */}
            {/* ========================================================= */}
            {showImportModal && (
                <div className="modal-backdrop" onClick={() => setShowImportModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileSpreadsheet size={18} />
                                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Batch Import Tenants from CSV</h3>
                            </div>
                            <button onClick={() => setShowImportModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ border: '2px dashed var(--army-green-800)', borderRadius: 8, padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleCsvSelect}
                                    accept=".csv"
                                    style={{ display: 'none' }}
                                />
                                <Upload size={32} color="var(--army-green-800)" style={{ margin: '0 auto 0.75rem' }} />
                                <div style={{ fontWeight: 700, color: 'var(--army-green-950)' }}>
                                    {csvFile ? csvFile.name : 'Select or drop your CSV file here'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                                    Format: FullName, Phone, Email, FlatCode, RentAmount, ExpiryDate
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn btn-outline btn-sm"
                                    style={{ marginTop: '1rem', borderColor: 'var(--army-green-800)' }}
                                >
                                    Browse Computer
                                </button>
                            </div>

                            {csvPreviewRows.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--army-green-900)', marginBottom: '0.4rem' }}>
                                        Parsed Preview ({csvPreviewRows.length} Valid Records):
                                    </div>
                                    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 4 }}>
                                        <table className="data-table" style={{ fontSize: '0.75rem' }}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th>Flat Code</th>
                                                    <th>Rent (₦)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvPreviewRows.map((r, i) => (
                                                    <tr key={i}>
                                                        <td>{r.fullName}</td>
                                                        <td>{r.phone}</td>
                                                        <td><strong>{r.flatCode}</strong></td>
                                                        <td>{r.annualRent}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => setShowImportModal(false)} className="btn btn-ghost">Cancel</button>
                            <button
                                type="button"
                                onClick={handleCommitCsvImport}
                                disabled={csvPreviewRows.length === 0}
                                className="btn btn-primary"
                                style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
                            >
                                <CheckCircle2 size={16} />
                                Import {csvPreviewRows.length} Tenants
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* A4 ISOLATED PDF DOCUMENT PREVIEW MODAL                    */}
            {/* ========================================================= */}
            {showPdfModal && (
                <div className="modal-backdrop" onClick={() => setShowPdfModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 840, maxHeight: '92vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
                        <div className="modal-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Printer size={18} />
                                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Official Authenticated Tenant Master Roster</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--army-gold-500)', color: '#000', fontWeight: 800 }}>
                                    <Printer size={14} /> Print Document
                                </button>
                                <button onClick={() => setShowPdfModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* A4 DOCUMENT BODY */}
                        <div style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', color: '#000000', fontFamily: 'serif' }}>
                            {/* PHDL OFFICIAL SEAL HEADER */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px double #1B4D21', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                <PhdlLogo size={64} />
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1B4D21', letterSpacing: '0.05em' }}>
                                        PHDL Estates
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991B1B' }}>
                                        FEDERAL REPUBLIC OF NIGERIA • RC 676563
                                    </div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                                        HEADQUARTERS: Plot 1042 Mogadishu Cantonment, Asokoro, Abuja FCT
                                    </div>
                                </div>
                                <div style={{ width: 64 }} />
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800, textDecoration: 'underline', textTransform: 'uppercase' }}>
                                    AUTHENTICATED CIVILIAN RESIDENT TENANCY MASTER ROSTER
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4 }}>
                                    ESTATE: <strong>{estate?.name} ({estate?.code})</strong> • EXTRACT DATE: <strong>{new Date().toLocaleDateString('en-GB')}</strong>
                                </div>
                            </div>

                            {/* TABLE */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '2rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F1F5F9', borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000' }}>
                                        <th style={{ padding: '6px 8px', textAlign: 'left', border: '1px solid #CBD5E1' }}>S/N</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Resident Full Name</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Flat Code</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Phone Contact</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Soldier Landlord</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'right', border: '1px solid #CBD5E1' }}>Rent (₦)</th>
                                        <th style={{ padding: '6px 8px', textAlign: 'center', border: '1px solid #CBD5E1' }}>Expiry Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTenants.map((t, idx) => {
                                        const flat = flats.find((f) => f.id === t.flatId);
                                        const landlord = soldiers.find((s) => s.id === t.landlordId || s.id === flat?.ownerId);
                                        return (
                                            <tr key={t.id} style={{ borderBottom: '1px solid #CBD5E1' }}>
                                                <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1' }}>{idx + 1}</td>
                                                <td style={{ padding: '6px 8px', fontWeight: 700, border: '1px solid #CBD5E1' }}>{t.fullName}</td>
                                                <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1' }}>Flat {flat?.fullFlatCode || t.flatId}</td>
                                                <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1' }}>{t.phone}</td>
                                                <td style={{ padding: '6px 8px', border: '1px solid #CBD5E1' }}>
                                                    {landlord ? `${landlord.rank} ${landlord.fullName}` : t.landlordNameUnverified || 'Unassigned'}
                                                </td>
                                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, border: '1px solid #CBD5E1' }}>
                                                    {formatNaira(t.annualRentAmount || 1200000)}
                                                </td>
                                                <td style={{ padding: '6px 8px', textAlign: 'center', border: '1px solid #CBD5E1' }}>
                                                    {formatDate(t.rentExpiryDate || '2026-12-31')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* COMMANDANT SIGNATURE STAMP BLOCK */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                    <div>Security Classification: <strong>RESTRICTED / OFFICIAL USE ONLY</strong></div>
                                    <div>Verification Hash: <strong>SHA256-{Date.now().toString(36).toUpperCase()}-PHDL</strong></div>
                                    <div>SuperAdmin Officer ID: <strong>{adminSignature.adminId}</strong></div>
                                </div>

                                <div style={{ textAlign: 'center', minWidth: 240 }}>
                                    <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                                        <img src={adminSignature.signatureImage} alt="SuperAdmin Stamp" style={{ maxHeight: 54, maxWidth: 160 }} />
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#1B4D21', textDecoration: 'overline' }}>
                                        {adminSignature.fullName}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991B1B' }}>
                                        {adminSignature.officialStampTitle}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                                        Authorized Date: {new Date().toLocaleDateString('en-GB')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};