import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { ServiceTariffSettings, TariffItem } from '../../types';
import { CreditCard, Plus, Edit, Trash2, CheckCircle2, XCircle, ShieldAlert, Sparkles, Save, X } from 'lucide-react';
import { formatNaira, formatDate } from '../../utils/formatters';

export const AdminTariffsManagementPage: React.FC = () => {
    const store = usePhdlStore();
    const currentEstateId = store.getActiveEstateId();
    const tariff = store.getTariffSettings();
    const adminSignature = store.getSuperAdminSignature();

    const [monthlyRate, setMonthlyRate] = useState<number>(tariff.standardMonthlyRate || tariff.monthlyRate || 10000);
    const [threeMonthsRate, setThreeMonthsRate] = useState<number>(tariff.activeBulkCharges?.threeMonths || tariff.threeMonthsAmount || 30000);
    const [sixMonthsRate, setSixMonthsRate] = useState<number>(tariff.activeBulkCharges?.sixMonths || tariff.sixMonthsAmount || 60000);
    const [annualRate, setAnnualRate] = useState<number>(tariff.activeBulkCharges?.annual || tariff.annualAmount || 120000);
    const [remarks, setRemarks] = useState(tariff.remarks || '');
    const [notice, setNotice] = useState<string | null>(null);

    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [newSignatureImage, setNewSignatureImage] = useState(adminSignature.signatureImage);
    const [signatureName, setSignatureName] = useState(adminSignature.fullName);
    const [signatureTitle, setSignatureTitle] = useState(adminSignature.officialStampTitle);

    const handleUpdateTariff = (e: React.FormEvent) => {
        e.preventDefault();
        const updated: ServiceTariffSettings = {
            estateId: currentEstateId,
            standardMonthlyRate: Number(monthlyRate),
            permittedBulkMultipliers: [3, 6, 12],
            activeBulkCharges: {
                threeMonths: Number(threeMonthsRate),
                sixMonths: Number(sixMonthsRate),
                annual: Number(annualRate),
            },
            lastUpdatedDate: new Date().toISOString().split('T')[0],
            lastUpdatedBy: `${adminSignature.fullName} (${adminSignature.adminId})`,
            remarks: remarks.trim(),
        };

        store.updateTariffSettings(updated, remarks);
        setNotice(`✓ Successfully validated and published standard ₦${Number(monthlyRate).toLocaleString()}/mo service tariffs.`);
        setTimeout(() => setNotice(null), 3500);
    };

    const handleSaveSignature = (e: React.FormEvent) => {
        e.preventDefault();
        store.updateSuperAdminSignature({
            adminId: adminSignature.adminId,
            fullName: signatureName.trim(),
            rank: 'Colonel',
            signatureImage: newSignatureImage,
            officialStampTitle: signatureTitle.trim(),
            authorizedAt: new Date().toISOString(),
        });
        setShowSignatureModal(false);
        setNotice('✓ Digital verification signature stamp updated successfully.');
        setTimeout(() => setNotice(null), 3500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-overline">
                        <span>SUPERADMIN LEVY CONTROLLER</span> • <span>TARIFF LIFECYCLE</span>
                    </div>
                    <h1>Tariffs, Levies & Official Signature Stamps</h1>
                    <p>
                        SuperAdmin-exclusive module to establish, validate, modify, and cancel estate service charge tariffs with authorized signature verification.
                    </p>
                </div>

                <button
                    onClick={() => setShowSignatureModal(true)}
                    className="btn btn-outline"
                    style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}
                >
                    <Sparkles size={16} /> Configure SuperAdmin Signature Stamp
                </button>
            </div>

            {notice && (
                <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                    {notice}
                </div>
            )}

            {/* Active Signature Stamp Preview Card */}
            <div className="card" style={{ padding: '1.5rem', border: '1.5px solid var(--army-gold-500)', backgroundColor: '#FAFAF9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--army-green-900)', textTransform: 'uppercase' }}>
                            ACTIVE SUPERADMIN DIGITAL VERIFICATION STAMP
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--army-green-950)' }}>
                            {adminSignature.fullName} (ID: {adminSignature.adminId})
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--army-red-700)', fontWeight: 700 }}>
                            {adminSignature.officialStampTitle}
                        </div>
                    </div>
                    <div style={{ padding: '0.5rem 1rem', border: '1px solid #CBD5E1', borderRadius: 6, backgroundColor: '#FFFFFF' }}>
                        <img src={adminSignature.signatureImage} alt="Official Stamp" style={{ maxHeight: 48 }} />
                    </div>
                </div>
            </div>

            {/* Main Tariff Configuration Form */}
            <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', color: 'var(--army-green-950)' }}>
                    Standard Estate Service Charge & Bulk Multipliers
                </h3>

                <form onSubmit={handleUpdateTariff} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Base Monthly Tariff (₦) *</label>
                            <input
                                type="number"
                                value={monthlyRate}
                                onChange={(e) => {
                                    const m = Number(e.target.value);
                                    setMonthlyRate(m);
                                    setThreeMonthsRate(m * 3);
                                    setSixMonthsRate(m * 6);
                                    setAnnualRate(m * 12);
                                }}
                                className="form-control"
                                min={1000}
                                step={500}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">3-Month Bulk Bundle (₦)</label>
                            <input type="number" value={threeMonthsRate} onChange={(e) => setThreeMonthsRate(Number(e.target.value))} className="form-control" required />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">6-Month Bulk Bundle (₦)</label>
                            <input type="number" value={sixMonthsRate} onChange={(e) => setSixMonthsRate(Number(e.target.value))} className="form-control" required />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">12-Month (Annual) Bundle (₦)</label>
                            <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="form-control" required />
                        </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">SuperAdmin Validation Justification & Remarks *</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="form-control"
                            rows={3}
                            placeholder="e.g. Approved mandatory ₦10,000/month service charge tariff under PHDL Resolution RC 676563..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)', padding: '0.65rem 1.5rem' }}>
                            <CheckCircle2 size={16} /> Validate & Publish Standard Tariff
                        </button>
                    </div>
                </form>
            </div>

            {/* Signature Configuration Modal */}
            {showSignatureModal && (
                <div className="modal-backdrop" onClick={() => setShowSignatureModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>SuperAdmin Digital Signature Stamp</h3>
                            <button onClick={() => setShowSignatureModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveSignature}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Signatory Officer Full Name</label>
                                    <input type="text" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className="form-control" required />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Official Seal Stamp Title</label>
                                    <input type="text" value={signatureTitle} onChange={(e) => setSignatureTitle(e.target.value)} className="form-control" required />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Signature Vector / SVG Stamp Data</label>
                                    <textarea value={newSignatureImage} onChange={(e) => setNewSignatureImage(e.target.value)} className="form-control" rows={3} required />
                                </div>
                            </div>
                            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" onClick={() => setShowSignatureModal(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--army-green-800)' }}>
                                    <Save size={15} /> Save Signature Stamp
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};