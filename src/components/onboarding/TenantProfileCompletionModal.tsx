import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Dependent, Tenant } from '../../types';
import {
    Users,
    HeartHandshake,
    Plus,
    Trash2,
    CheckCircle2,
    X,
    Save,
    Clock,
} from 'lucide-react';

interface TenantProfileCompletionModalProps {
    tenant: Tenant;
    onClose: () => void;
    onSaved: () => void;
}

export const TenantProfileCompletionModal: React.FC<TenantProfileCompletionModalProps> = ({
    tenant,
    onClose,
    onSaved,
}) => {
    const store = usePhdlStore();

    // Dependents List State
    const [dependents, setDependents] = useState<Dependent[]>(
        tenant.dependents || []
    );
    const [depName, setDepName] = useState('');
    const [depRelation, setDepRelation] = useState('Spouse');
    const [depAge, setDepAge] = useState<number>(30);

    // Emergency Contact State
    const [iceName, setIceName] = useState(tenant.emergencyContact?.name || '');
    const [iceRelation, setIceRelation] = useState(tenant.emergencyContact?.relationship || 'Next of Kin');
    const [icePhone, setIcePhone] = useState(tenant.emergencyContact?.phone || '');

    const handleAddDependent = () => {
        if (!depName.trim()) return;
        const newDep: Dependent = {
            id: `dep-${Date.now()}`,
            fullName: depName.trim(),
            relationship: depRelation,
            age: depAge,
            gender: 'male',
            idCardNumber: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setDependents([...dependents, newDep]);
        setDepName('');
    };

    const handleRemoveDependent = (id: string) => {
        setDependents(dependents.filter((d) => d.id !== id));
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTenant: Tenant = {
            ...tenant,
            dependents,
            dependentsCount: dependents.length,
            emergencyContact: iceName
                ? {
                    name: iceName.trim(),
                    relationship: iceRelation,
                    phone: icePhone.trim(),
                }
                : undefined,
            profileIncomplete: false, // Marked complete
        };

        store.updateTenant(updatedTenant);
        onSaved();
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(4px)',
                zIndex: 990,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: 620,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    overflow: 'hidden',
                    border: '1.5px solid var(--army-gold-500)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, var(--army-green-950) 0%, var(--army-green-900) 100%)',
                        padding: '1.1rem 1.5rem',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid var(--army-gold-400)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Users size={20} color="var(--army-gold-400)" />
                        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF' }}>
                            Complete Your Household & Emergency Profile
                        </h3>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSaveProfile} style={{ padding: '1.5rem', maxHeight: '78vh', overflowY: 'auto' }}>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Welcome to PHDL Unity Estate, <strong>{tenant.fullName}</strong>! Complete your household dependents and emergency contacts for security clearance.
                    </p>

                    {/* Section 1: Household Dependents */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                            <Users size={16} color="var(--army-green-800)" />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
                                Household Dependents ({dependents.length})
                            </strong>
                        </div>

                        {/* List of Added Dependents */}
                        {dependents.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.85rem' }}>
                                {dependents.map((dep) => (
                                    <div
                                        key={dep.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0.75rem',
                                            backgroundColor: '#F8FAFC',
                                            border: '1px solid var(--border-light)',
                                            borderRadius: 'var(--radius-md)',
                                        }}
                                    >
                                        <div>
                                            <strong style={{ fontSize: '0.85rem' }}>{dep.fullName}</strong>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
                                                ({dep.relationship} • {dep.age} yrs)
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDependent(dep.id)}
                                            className="btn btn-ghost btn-sm"
                                            style={{ padding: '0.2rem', color: 'var(--army-red-700)' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Dependent Inline Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.7fr auto', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={depName}
                                onChange={(e) => setDepName(e.target.value)}
                                placeholder="Dependent Full Name"
                                className="form-control"
                                style={{ fontSize: '0.8rem' }}
                            />
                            <select
                                value={depRelation}
                                onChange={(e) => setDepRelation(e.target.value)}
                                className="form-select"
                                style={{ fontSize: '0.8rem' }}
                            >
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Ward">Ward</option>
                                <option value="Relative">Relative</option>
                            </select>
                            <input
                                type="number"
                                value={depAge}
                                onChange={(e) => setDepAge(Number(e.target.value))}
                                placeholder="Age"
                                min={1}
                                max={100}
                                className="form-control"
                                style={{ fontSize: '0.8rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleAddDependent}
                                className="btn btn-outline btn-sm"
                                style={{ gap: '0.2rem' }}
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>

                    {/* Section 2: In Case of Emergency (ICE) */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                            <HeartHandshake size={16} color="var(--army-red-700)" />
                            <strong style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>
                                In Case of Emergency (ICE) Contact
                            </strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={iceName}
                                onChange={(e) => setIceName(e.target.value)}
                                placeholder="Emergency Contact Name"
                                className="form-control"
                            />
                            <input
                                type="text"
                                value={iceRelation}
                                onChange={(e) => setIceRelation(e.target.value)}
                                placeholder="Relationship (e.g. Brother)"
                                className="form-control"
                            />
                        </div>

                        <input
                            type="tel"
                            value={icePhone}
                            onChange={(e) => setIcePhone(e.target.value)}
                            placeholder="Emergency Contact Phone Number (+234...)"
                            className="form-control"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ gap: '0.3rem', fontSize: '0.8rem' }}>
                            <Clock size={14} />
                            Remind Me Later (Skip for Now)
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
                        >
                            <Save size={16} />
                            Save Profile Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};