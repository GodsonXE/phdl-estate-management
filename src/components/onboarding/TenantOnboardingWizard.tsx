import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { commitTenantOnboarding, TenancyOnboardingPayload } from '../../services/onboardingService';
import { PhdlLogo } from '../common/PhdlLogo';
import {
    Building2,
    Home,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
} from 'lucide-react';

interface TenantOnboardingWizardProps {
    initialEmail?: string;
    onComplete: () => void;
}

export const TenantOnboardingWizard: React.FC<TenantOnboardingWizardProps> = ({
    initialEmail = '',
    onComplete,
}) => {
    const store = usePhdlStore();
    const estates = store.getEstates() || [];

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedEstateId, setSelectedEstateId] = useState<string>(
        sessionStorage.getItem('phdl_onboarding_estate_id') || estates[0]?.id || ''
    );

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState(initialEmail || 'tenant.resident@gmail.com');
    const [selectedFlatId, setSelectedFlatId] = useState('');
    const [rentPaymentDate, setRentPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [rentAmount, setRentAmount] = useState<number>(1200000);
    const [typedLandlordName, setTypedLandlordName] = useState('');
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const flats = store.getFlats(selectedEstateId) || [];
    const lanes = store.getLanes(selectedEstateId) || [];

    const validatePhone = (val: string): boolean => {
        const clean = val.replace(/[\s-]/g, '');
        const ngRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;
        if (!ngRegex.test(clean)) {
            setPhoneError('Please enter a valid Nigerian mobile number (e.g. 08031234567 or +2348031234567)');
            return false;
        }
        setPhoneError(null);
        return true;
    };

    const handleStep1Continue = () => {
        if (!selectedEstateId) return;
        sessionStorage.setItem('phdl_onboarding_estate_id', selectedEstateId);
        store.setActiveEstateId(selectedEstateId);
        setStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!fullName.trim()) {
            setFormError('Full Name is required.');
            return;
        }
        if (!validatePhone(phone)) return;
        if (!selectedFlatId) {
            setFormError('Please select your assigned Flat in the estate.');
            return;
        }
        if (!rentAmount || rentAmount <= 0) {
            setFormError('Please enter a valid rent amount paid.');
            return;
        }

        setStep(3);

        const payload: TenancyOnboardingPayload = {
            estateId: selectedEstateId,
            fullName,
            phone,
            email,
            flatId: selectedFlatId,
            rentPaymentDate,
            rentAmountPaid: Number(rentAmount),
            typedLandlordName: typedLandlordName.trim() || undefined,
        };

        setTimeout(() => {
            commitTenantOnboarding(payload, store);
            sessionStorage.removeItem('phdl_onboarding_estate_id');
            onComplete();
        }, 1000);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: step === 1 ? 520 : 680,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                    border: '2px solid var(--army-green-800)',
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, var(--army-green-950) 0%, var(--army-green-850) 100%)',
                        padding: '1.25rem 1.5rem',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '3px solid var(--army-gold-500)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <PhdlLogo size={46} />
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 900 }}>
                                PHDL Tenant Onboarding
                            </h3>
                            <div style={{ fontSize: '0.7rem', color: 'var(--army-gold-300)', fontWeight: 700 }}>
                                STEP {step} OF 2: {step === 1 ? 'SELECT YOUR ESTATE' : 'TENANCY & RESIDENCE DETAILS'}
                            </div>
                        </div>
                    </div>
                    <span className="badge badge-military" style={{ fontSize: '0.7rem' }}>
                        Mandatory Setup
                    </span>
                </div>

                {/* STEP 1: SELECT ESTATE */}
                {step === 1 && (
                    <div style={{ padding: '1.75rem' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h4 style={{ margin: '0 0 0.4rem', color: 'var(--army-green-950)', fontSize: '1.15rem' }}>
                                Select Your Assigned PHDL Estate
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Please choose the Post-Service Housing Development Limited estate where your tenancy is located.
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">
                                <Building2 size={15} style={{ display: 'inline', marginRight: 4 }} />
                                PHDL Housing Scheme Estate:
                            </label>
                            <select
                                value={selectedEstateId}
                                onChange={(e) => setSelectedEstateId(e.target.value)}
                                className="form-select"
                                style={{ fontSize: '0.95rem', padding: '0.65rem 0.85rem' }}
                                required
                            >
                                {estates.map((estate) => (
                                    <option key={estate.id} value={estate.id}>
                                        {estate.name} ({estate.code}) — {estate.city}, {estate.state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={handleStep1Continue}
                                disabled={!selectedEstateId}
                                className="btn btn-primary"
                                style={{ gap: '0.5rem', backgroundColor: 'var(--army-green-800)', padding: '0.65rem 1.5rem' }}
                            >
                                Continue to Tenancy Details
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: TENANT DETAILS */}
                {step === 2 && (
                    <form onSubmit={handleStep2Submit} style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <h4 style={{ margin: '0 0 0.25rem', color: 'var(--army-green-950)', fontSize: '1.15rem' }}>
                                Tenancy & Housing Allocation Information
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Estate: <strong>{estates.find((e) => e.id === selectedEstateId)?.name}</strong>
                            </p>
                        </div>

                        {formError && (
                            <div
                                style={{
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--status-danger-bg)',
                                    color: 'var(--status-danger-text)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                <AlertCircle size={15} />
                                {formError}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Emeka Gabriel Okon"
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        if (phoneError) validatePhone(e.target.value);
                                    }}
                                    onBlur={() => validatePhone(phone)}
                                    placeholder="e.g. 0803 123 4567"
                                    className="form-control"
                                    required
                                />
                                {phoneError && (
                                    <div style={{ fontSize: '0.7rem', color: 'var(--army-red-700)', marginTop: '0.2rem' }}>
                                        {phoneError}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Email Address *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label">
                                <Home size={14} style={{ display: 'inline', marginRight: 4 }} />
                                Assigned Flat Number *
                            </label>
                            <select
                                value={selectedFlatId}
                                onChange={(e) => setSelectedFlatId(e.target.value)}
                                className="form-select"
                                required
                            >
                                <option value="">-- Choose Flat in Estate --</option>
                                {flats.map((flat) => {
                                    const lane = lanes.find((l) => l.id === flat.laneId);
                                    return (
                                        <option key={flat.id} value={flat.id}>
                                            {lane?.name}, Flat {flat.fullFlatCode} — (2-Bedroom Standard)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Date of Rent Payment *</label>
                                <input
                                    type="date"
                                    value={rentPaymentDate}
                                    onChange={(e) => setRentPaymentDate(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Rent Amount Paid (₦) *</label>
                                <input
                                    type="number"
                                    value={rentAmount}
                                    onChange={(e) => setRentAmount(Number(e.target.value))}
                                    min={1000}
                                    step={1000}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">
                                Landlord Name <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={typedLandlordName}
                                onChange={(e) => setTypedLandlordName(e.target.value)}
                                placeholder="e.g. Staff Sgt. Danjuma (If known)"
                                className="form-control"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn btn-ghost"
                                style={{ fontSize: '0.85rem' }}
                            >
                                ← Back to Estate
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ gap: '0.5rem', backgroundColor: 'var(--army-green-800)', padding: '0.65rem 1.75rem' }}
                            >
                                <CheckCircle2 size={16} />
                                Complete Setup & Enter Dashboard
                            </button>
                        </div>
                    </form>
                )}

                {/* STEP 3: LOADING RESOLUTION */}
                {step === 3 && (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                        <Loader2
                            size={48}
                            color="var(--army-green-800)"
                            style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}
                        />
                        <h4 style={{ margin: '0 0 0.5rem', color: 'var(--army-green-950)', fontSize: '1.2rem' }}>
                            Resolving Tenancy & Landlord Registry...
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Verifying flat allocation, connecting soldier landlord profile, and generating your smart digital gate pass.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};