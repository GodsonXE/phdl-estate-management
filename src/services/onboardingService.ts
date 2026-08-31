import { Tenant, Flat, Soldier, AuditLog } from '../types';

export interface TenancyOnboardingPayload {
    estateId: string;
    fullName: string;
    phone: string;
    email: string;
    flatId: string;
    rentPaymentDate: string;
    rentAmountPaid: number;
    typedLandlordName?: string;
}

export interface LandlordResolutionResult {
    isResolved: boolean;
    landlord: Soldier | null;
    hasMismatch: boolean;
    mismatchNote?: string;
}

/**
 * Reusable Landlord Resolution Engine
 * Checks flat owner and verifies against typed landlord name
 */
export const resolveTenantLandlord = (
    flatId: string,
    typedLandlordName: string | undefined,
    store: any
): LandlordResolutionResult => {
    const currentEstateId = store.getActiveEstateId();
    const flats: Flat[] = store.getFlats(currentEstateId) || [];
    const soldiers: Soldier[] = store.getSoldiers() || [];

    const flat = flats.find((f) => f.id === flatId);
    if (!flat || !flat.ownerId || flat.ownerId === 'soldier-unidentified') {
        return {
            isResolved: false,
            landlord: null,
            hasMismatch: false,
        };
    }

    const soldierOwner = soldiers.find((s) => s.id === flat.ownerId) || null;

    if (!soldierOwner) {
        return {
            isResolved: false,
            landlord: null,
            hasMismatch: false,
        };
    }

    // Check for discrepancy between typed name and official soldier record
    let hasMismatch = false;
    let mismatchNote: string | undefined;

    if (typedLandlordName && typedLandlordName.trim().length > 0) {
        const cleanTyped = typedLandlordName.toLowerCase().replace(/[^a-z]/g, '');
        const cleanOwner = soldierOwner.fullName.toLowerCase().replace(/[^a-z]/g, '');
        if (!cleanOwner.includes(cleanTyped) && !cleanTyped.includes(cleanOwner)) {
            hasMismatch = true;
            mismatchNote = `Tenant entered "${typedLandlordName}", but system-of-record landlord is "${soldierOwner.rank} ${soldierOwner.fullName}" (SVC: ${soldierOwner.serviceNumber}).`;
        }
    }

    return {
        isResolved: true,
        landlord: soldierOwner,
        hasMismatch,
        mismatchNote,
    };
};

/**
 * Execute complete onboarding commit:
 * 1. Resolves landlord
 * 2. Creates/updates Tenant record
 * 3. Updates Flat occupancy
 * 4. Logs audit mismatch if any
 * 5. Issues Digital Gate Pass
 */
export const commitTenantOnboarding = (
    payload: TenancyOnboardingPayload,
    store: any
): { tenant: Tenant; resolution: LandlordResolutionResult } => {
    const resolution = resolveTenantLandlord(payload.flatId, payload.typedLandlordName, store);

    const tenantId = `tenant-${Date.now()}`;
    const rentStart = payload.rentPaymentDate || new Date().toISOString().split('T')[0];
    const rentDateObj = new Date(rentStart);
    rentDateObj.setFullYear(rentDateObj.getFullYear() + 1);
    const rentExpiry = rentDateObj.toISOString().split('T')[0];

    const newTenant: Tenant = {
        id: tenantId,
        fullName: payload.fullName.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        flatId: payload.flatId,
        landlordId: resolution.landlord?.id,
        landlordNameUnverified: resolution.isResolved ? undefined : payload.typedLandlordName?.trim(),
        occupation: 'Resident Tenant',
        employer: 'Private Enterprise',
        rentStartDate: rentStart,
        rentExpiryDate: rentExpiry,
        rentPaymentDate: payload.rentPaymentDate,
        annualRentAmount: payload.rentAmountPaid,
        dependentsCount: 0,
        dependents: [],
        onboardingComplete: true,
        profileIncomplete: true, // Step 7 trigger
        idCardNumber: `PHDL-UNT-T-2026-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
    };

    // 1. Update Flat record
    const flats: Flat[] = store.getFlats(payload.estateId) || [];
    const targetFlat = flats.find((f) => f.id === payload.flatId);
    if (targetFlat) {
        targetFlat.currentTenantId = tenantId;
        targetFlat.status = targetFlat.ownerId && targetFlat.ownerId !== 'soldier-unidentified' ? 'sublet' : 'occupied';
        targetFlat.rentAmount = payload.rentAmountPaid;
        targetFlat.rentDate = payload.rentPaymentDate;
        store.updateFlat(targetFlat);
    }

    // 2. Add Tenant to storage
    const allTenants = store.getTenants() || [];
    localStorage.setItem('phdl_tenants_v7', JSON.stringify([newTenant, ...allTenants]));

    // 3. Log Audit if mismatch
    if (resolution.hasMismatch && resolution.mismatchNote) {
        const auditLog: AuditLog = {
            id: `aud-${Date.now()}`,
            estateId: payload.estateId,
            action: 'DATA_MODIFICATION',
            actorRole: 'tenant',
            actorId: tenantId,
            actorName: newTenant.fullName,
            targetEntity: 'Flat',
            targetEntityId: payload.flatId,
            details: `Landlord Name Mismatch Flagged: ${resolution.mismatchNote}`,
            status: 'flagged',
            timestamp: new Date().toISOString(),
        };
        if (typeof store.addAuditLog === 'function') {
            store.addAuditLog(auditLog);
        }
    }

    // 4. Set as active tenant in session
    if (typeof store.setActiveTenantId === 'function') {
        store.setActiveTenantId(tenantId);
    }
    if (typeof store.setActiveRole === 'function') {
        store.setActiveRole('tenant');
    }

    return { tenant: newTenant, resolution };
};