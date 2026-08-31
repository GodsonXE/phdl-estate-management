import {
  Estate,
  Lane,
  Flat,
  Soldier,
  Tenant,
  Dependent,
  Bill,
  Payment,
  IDCard,
  MaintenanceRequest,
  Notification,
  AuditLog,
  ServiceTariffSettings,
  PaymentGatewaySettings,
  BroadcastSmsSettings,
  SuperAdminSignature,
  UserProfileData,
  Role,
  AdminUser,
  EstatePreferencesAndSLA,
  EmailBroadcastPayload,
  SmsBroadcastPayload,
  PushBroadcastPayload,
} from '../types';
import {
  INITIAL_ESTATES,
  INITIAL_LANES,
  INITIAL_FLATS,
  INITIAL_SOLDIERS,
  INITIAL_TENANTS,
  INITIAL_BILLS,
  INITIAL_PAYMENTS,
  INITIAL_ID_CARDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './seedData';

// Fallback Default Settings
const DEFAULT_SERVICE_TARIFF: ServiceTariffSettings = {
  estateId: 'estate-unity-abuja',
  standardMonthlyRate: 10000,
  permittedBulkMultipliers: [3, 6, 12],
  activeBulkCharges: {
    threeMonths: 30000,
    sixMonths: 60000,
    annual: 120000,
  },
  lastUpdatedDate: '2026-01-01',
  lastUpdatedBy: 'PHDL SuperAdmin HQ',
  remarks: 'Official PHDL standard service charge tariff: ₦10,000/month payable exclusively in 3-month (₦30k), 6-month (₦60k), or annual (₦120k) bulk bundles.',
};

const DEFAULT_PAYMENT_GATEWAY_SETTINGS: PaymentGatewaySettings = {
  activeGateway: 'paystack',
  environment: 'test',
  paystack: {
    publicKey: 'pk_test_phdl_unity_mock_key_001',
    secretKey: 'sk_test_phdl_unity_secret_mock_key_002',
    webhookSecret: 'whsec_phdl_mock_hash_003',
    subaccountCode: 'ACCT_phdl_treasury_01',
    callbackUrl: 'https://unity.phdl.gov.ng/api/payments/paystack/callback',
  },
  flutterwave: {
    publicKey: 'FLWPUBK_TEST-phdl-unity-mock-001',
    secretKey: 'FLWSECK_TEST-phdl-unity-mock-002',
    encryptionKey: 'FLWSECK_TEST_ENC_mock',
    webhookSecret: 'whsec_flutterwave_mock_hash',
  },
  hybridSplitRatio: {
    paystackPercentage: 50,
    flutterwavePercentage: 50,
  },
};

const DEFAULT_BROADCAST_SMS_SETTINGS: BroadcastSmsSettings = {
  primaryProvider: 'termii',
  senderId: 'PHDL-ESTATE',
  termii: {
    apiKey: 'TL_TER_phdl_mock_key_2026_unity',
    baseUrl: 'https://api.ng.termii.com/api',
    channel: 'generic',
  },
  bulkSmsNigeria: {
    apiToken: 'BSN_token_phdl_mock_key_2026',
    baseUrl: 'https://www.bulksmsnigeria.com/api/v1/sms/create',
    gateway: 'corporate-priority',
  },
  routes: {
    rentReminders: true,
    serviceChargeInvoices: true,
    emergencySecurityBroadcasts: true,
    gatePassClearanceOtp: true,
    maintenanceUpdates: true,
  },
};

const DEFAULT_ESTATE_PREFERENCES_SLA: EstatePreferencesAndSLA = {
  estateId: 'estate-unity-abuja',
  emergencySlaHours: 2,
  highPrioritySlaHours: 6,
  standardSlaHours: 24,
  lowPrioritySlaHours: 48,
  disputeResolutionSlaDays: 2,
  gatePassApprovalSlaHours: 12,
  residentGateAccess: '24/7 Unrestricted with Smart QR Pass',
  visitorCurfewTime: '22:00',
  contractorAccessWindow: '08:00 - 18:00 (Mon - Sat)',
  nightPatrolIntervalMins: 45,
  generatorMorningSchedule: '05:30 - 08:00',
  generatorEveningSchedule: '18:30 - 23:30',
  waterSupplyMorning: '06:00 - 09:00',
  waterSupplyEvening: '17:00 - 20:00',
  wasteEvacuationDays: ['Monday', 'Thursday'],
  dumpingPenaltyFee: 25000,
  noiseRegulationCurfew: '22:00 - 06:00',
  rentGracePeriodDays: 14,
  lastUpdatedBy: 'Col. Farouk Danjuma (Rtd.)',
  lastUpdatedAt: '2026-01-01T08:00:00Z',
};

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-01',
    adminId: 'ADM-HQ-001',
    fullName: 'Col. Farouk Danjuma (Rtd.)',
    email: 'commandant.hq@phdl.gov.ng',
    phone: '+234 803 999 0001',
    rank: 'Colonel',
    roleTitle: 'HQ SuperAdmin',
    laneClearance: 'All Lanes',
    privileges: {
      canModifyFlats: true,
      canApproveKYC: true,
      canModifyTenants: true,
      canManageTariffs: true,
      canSendBulkSMS: true,
      canSendEmailBroadcast: true,
      canExportDocuments: true,
      canAssignPrivileges: true,
      canSignDocuments: true,
      canAccessAuditLogs: true,
    },
    signatureStampImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60"><path d="M10,40 Q30,10 60,30 T110,25 T150,35" fill="none" stroke="%231B4D21" stroke-width="2.5" stroke-linecap="round"/><circle cx="140" cy="20" r="3" fill="%23991B1B"/></svg>',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'adm-02',
    adminId: 'ADM-EST-002',
    fullName: 'Maj. Ibrahim Gambo',
    email: 'i.gambo@phdl.gov.ng',
    phone: '+234 803 888 0002',
    rank: 'Major',
    roleTitle: 'Estate Manager',
    laneClearance: 'All Lanes',
    privileges: {
      canModifyFlats: true,
      canApproveKYC: true,
      canModifyTenants: true,
      canManageTariffs: false,
      canSendBulkSMS: true,
      canSendEmailBroadcast: true,
      canExportDocuments: true,
      canAssignPrivileges: false,
      canSignDocuments: true,
      canAccessAuditLogs: false,
    },
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 'adm-03',
    adminId: 'ADM-AUD-003',
    fullName: 'Capt. Ngozi Adeleke',
    email: 'n.adeleke@phdl.gov.ng',
    phone: '+234 803 777 0003',
    rank: 'Captain',
    roleTitle: 'Audit & Compliance Officer',
    laneClearance: 'All Lanes',
    privileges: {
      canModifyFlats: false,
      canApproveKYC: false,
      canModifyTenants: false,
      canManageTariffs: false,
      canSendBulkSMS: false,
      canSendEmailBroadcast: true,
      canExportDocuments: true,
      canAssignPrivileges: false,
      canSignDocuments: false,
      canAccessAuditLogs: true,
    },
    status: 'active',
    createdAt: '2026-02-01',
  },
  {
    id: 'adm-04',
    adminId: 'ADM-SEC-004',
    fullName: 'Warrant Officer Musa Bello',
    email: 'gate.security@phdl.gov.ng',
    phone: '+234 803 666 0004',
    rank: 'Warrant Officer',
    roleTitle: 'Security Gate Marshal',
    laneClearance: 'All Lanes',
    privileges: {
      canModifyFlats: false,
      canApproveKYC: false,
      canModifyTenants: false,
      canManageTariffs: false,
      canSendBulkSMS: false,
      canSendEmailBroadcast: false,
      canExportDocuments: false,
      canAssignPrivileges: false,
      canSignDocuments: false,
      canAccessAuditLogs: false,
    },
    status: 'active',
    createdAt: '2026-02-10',
  },
];

const STORAGE_KEYS = {
  ESTATES: 'phdl_estates_v7',
  LANES: 'phdl_lanes_v7',
  FLATS: 'phdl_flats_v7',
  SOLDIERS: 'phdl_soldiers_v7',
  TENANTS: 'phdl_tenants_v7',
  BILLS: 'phdl_bills_v7',
  PAYMENTS: 'phdl_payments_v7',
  ID_CARDS: 'phdl_id_cards_v7',
  MAINTENANCE: 'phdl_maintenance_v7',
  NOTIFICATIONS: 'phdl_notifications_v7',
  AUDIT_LOGS: 'phdl_audit_logs_v7',
  TARIFF_SETTINGS: 'phdl_tariff_settings_v7',
  PAYMENT_GATEWAY_SETTINGS: 'phdl_gateway_settings_v7',
  BROADCAST_SMS_SETTINGS: 'phdl_broadcast_sms_settings_v7',
  ESTATE_PREFERENCES_SLA: 'phdl_estate_sla_v7',
  ADMIN_USERS: 'phdl_admin_users_v7',
  BROADCAST_HISTORY: 'phdl_broadcast_history_v7',
  ADMIN_PROFILE: 'phdl_admin_profile_v7',
  ACTIVE_ROLE: 'phdl_active_role_v7',
  ACTIVE_ESTATE_ID: 'phdl_active_estate_id_v7',
  ACTIVE_SOLDIER_ID: 'phdl_active_soldier_id_v7',
  ACTIVE_TENANT_ID: 'phdl_active_tenant_id_v7',
};

const getStoredData = <T>(key: string, defaultData: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading storage key ${key}:`, error);
    return defaultData;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting storage key ${key}:`, error);
  }
};

export const usePhdlStore = () => {
  // -------------------------------------------------------------
  // ESTATES & STRUCTURE
  // -------------------------------------------------------------
  const getEstates = (): Estate[] => {
    return getStoredData<Estate[]>(STORAGE_KEYS.ESTATES, INITIAL_ESTATES || []);
  };

  const getEstateById = (id: string): Estate | undefined => {
    const estates = getEstates();
    return estates.find((e) => e.id === id) || estates[0];
  };

  const getLanes = (estateId?: string): Lane[] => {
    const lanes = getStoredData<Lane[]>(STORAGE_KEYS.LANES, INITIAL_LANES || []);
    if (estateId) return lanes.filter((l) => l.estateId === estateId);
    return lanes;
  };

  const getLaneById = (id: string): Lane | undefined => {
    const lanes = getLanes();
    return lanes.find((l) => l.id === id);
  };

  const getFlats = (estateId?: string): Flat[] => {
    const flats = getStoredData<Flat[]>(STORAGE_KEYS.FLATS, INITIAL_FLATS || []);
    if (estateId) return flats.filter((f) => f.estateId === estateId);
    return flats;
  };

  const getFlatById = (id: string): Flat | undefined => {
    const flats = getFlats();
    return flats.find((f) => f.id === id);
  };

  const updateFlat = (flat: Flat): void => {
    const flats = getFlats();
    const index = flats.findIndex((f) => f.id === flat.id);
    if (index >= 0) {
      flats[index] = flat;
    } else {
      flats.push(flat);
    }
    setStoredData(STORAGE_KEYS.FLATS, flats);
  };

  // -------------------------------------------------------------
  // SOLDIERS (LANDLORDS)
  // -------------------------------------------------------------
  const getSoldiers = (_estateId?: string): Soldier[] => {
    return getStoredData<Soldier[]>(STORAGE_KEYS.SOLDIERS, INITIAL_SOLDIERS || []);
  };

  const getSoldierById = (id?: string): Soldier | undefined => {
    const soldiers = getSoldiers();
    if (!id) return soldiers[0];
    return soldiers.find((s) => s.id === id) || soldiers[0];
  };

  const addSoldier = (soldier: Soldier): void => {
    const soldiers = getSoldiers();
    setStoredData(STORAGE_KEYS.SOLDIERS, [soldier, ...soldiers]);
  };

  const updateSoldier = (soldier: Soldier): void => {
    const soldiers = getSoldiers();
    const index = soldiers.findIndex((s) => s.id === soldier.id);
    if (index >= 0) {
      soldiers[index] = soldier;
    } else {
      soldiers.unshift(soldier);
    }
    setStoredData(STORAGE_KEYS.SOLDIERS, soldiers);
  };

  // -------------------------------------------------------------
  // TENANTS (CIVILIAN RESIDENTS)
  // -------------------------------------------------------------
  const getTenants = (estateId?: string): Tenant[] => {
    const tenants = getStoredData<Tenant[]>(STORAGE_KEYS.TENANTS, INITIAL_TENANTS || []);
    if (!estateId) return tenants;
    return tenants.filter((t) => !t.estateId || t.estateId === estateId);
  };

  const getTenantById = (id?: string): Tenant | undefined => {
    const tenants = getTenants();
    if (!id) return tenants[0];
    return tenants.find((t) => t.id === id) || tenants[0];
  };

  const addTenant = (tenant: Tenant): void => {
    const tenants = getTenants();
    setStoredData(STORAGE_KEYS.TENANTS, [tenant, ...tenants]);
  };

  const updateTenant = (tenant: Tenant): void => {
    const tenants = getTenants();
    const index = tenants.findIndex((t) => t.id === tenant.id);
    if (index >= 0) {
      tenants[index] = tenant;
    } else {
      tenants.unshift(tenant);
    }
    setStoredData(STORAGE_KEYS.TENANTS, tenants);
  };

  // -------------------------------------------------------------
  // HOUSEHOLD DEPENDENTS
  // -------------------------------------------------------------
  const getDependents = (tenantId?: string): Dependent[] => {
    const tenants = getTenants();
    const targetId = tenantId || getActiveTenantId();
    const t = tenants.find((item) => item.id === targetId) || tenants[0];
    return t?.dependents || [];
  };

  const addDependent = (dependent: Dependent, tenantId?: string): void => {
    const targetId = tenantId || getActiveTenantId();
    const tenants = getTenants();
    const t = tenants.find((item) => item.id === targetId);
    if (t) {
      t.dependents = [...(t.dependents || []), dependent];
      t.dependentsCount = t.dependents.length;
      updateTenant(t);
    }
  };

  const removeDependent = (dependentId: string, tenantId?: string): void => {
    const targetId = tenantId || getActiveTenantId();
    const tenants = getTenants();
    const t = tenants.find((item) => item.id === targetId);
    if (t) {
      t.dependents = (t.dependents || []).filter((d) => d.id !== dependentId);
      t.dependentsCount = t.dependents.length;
      updateTenant(t);
    }
  };

  // -------------------------------------------------------------
  // LEASE AGREEMENTS
  // -------------------------------------------------------------
  const getLeases = (tenantId?: string) => {
    const tenants = getTenants();
    const flats = getFlats();
    const soldiers = getSoldiers();

    const leases = tenants.map((t) => {
      const flat = flats.find((f) => f.id === t.flatId);
      const landlord = soldiers.find((s) => s.id === t.landlordId || s.id === flat?.ownerId);
      return {
        id: `lease-${t.id}`,
        tenantId: t.id,
        tenantName: t.fullName,
        tenantPhone: t.phone,
        tenantEmail: t.email,
        flatId: t.flatId,
        flatCode: flat?.fullFlatCode || 'L1H1A',
        landlordId: landlord?.id,
        landlordName: landlord ? `${landlord.rank} ${landlord.fullName}` : 'UnIdentified Soldier',
        landlordPhone: landlord?.phone || '+234 803 000 0000',
        landlordEmail: landlord?.email || 'landlord@army.mil.ng',
        startDate: t.rentStartDate || '2026-01-01',
        expiryDate: t.rentExpiryDate || '2026-12-31',
        annualRent: t.annualRentAmount || flat?.rentAmount || 1200000,
        status: 'active' as const,
      };
    });

    if (tenantId) return leases.filter((l) => l.tenantId === tenantId);
    return leases;
  };

  const getLeaseById = (id: string) => {
    const leases = getLeases();
    return leases.find((l) => l.id === id);
  };

  // -------------------------------------------------------------
  // BILLING & PAYMENTS
  // -------------------------------------------------------------
  const getBills = (estateId?: string): Bill[] => {
    const bills = getStoredData<Bill[]>(STORAGE_KEYS.BILLS, INITIAL_BILLS || []);
    if (estateId) return bills.filter((b) => b.estateId === estateId);
    return bills;
  };

  const getBillById = (id: string): Bill | undefined => {
    const bills = getBills();
    return bills.find((b) => b.id === id);
  };

  const createBill = (bill: Bill): void => {
    const bills = getBills();
    setStoredData(STORAGE_KEYS.BILLS, [bill, ...bills]);
  };

  const updateBill = (bill: Bill): void => {
    const bills = getBills();
    const index = bills.findIndex((b) => b.id === bill.id);
    if (index >= 0) {
      bills[index] = bill;
      setStoredData(STORAGE_KEYS.BILLS, bills);
    }
  };

  const getPayments = (estateId?: string): Payment[] => {
    const payments = getStoredData<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS || []);
    if (estateId) return payments.filter((p) => p.estateId === estateId);
    return payments;
  };

  const recordPayment = (payment: Payment, billId?: string): void => {
    const payments = getPayments();
    setStoredData(STORAGE_KEYS.PAYMENTS, [payment, ...payments]);

    if (billId) {
      const bills = getBills();
      const bill = bills.find((b) => b.id === billId);
      if (bill) {
        bill.status = 'paid';
        bill.paidAmount = bill.totalAmount || bill.amount;
        bill.paymentReference = payment.reference;
        setStoredData(STORAGE_KEYS.BILLS, bills);
      }
    }
  };

  // -------------------------------------------------------------
  // SMART DIGITAL ID CARDS
  // -------------------------------------------------------------
  const getIDCards = (estateId?: string): IDCard[] => {
    const cards = getStoredData<IDCard[]>(STORAGE_KEYS.ID_CARDS, INITIAL_ID_CARDS || []);
    if (estateId) return cards.filter((c) => c.estateId === estateId);
    return cards;
  };

  const getIDCardById = (id: string): IDCard | undefined => {
    const cards = getIDCards();
    return cards.find((c) => c.id === id);
  };

  const issueIDCard = (card: IDCard): void => {
    const cards = getIDCards();
    const index = cards.findIndex((c) => c.id === card.id || c.holderId === card.holderId);
    if (index >= 0) {
      cards[index] = card;
    } else {
      cards.unshift(card);
    }
    setStoredData(STORAGE_KEYS.ID_CARDS, cards);
  };

  const updateIDCard = (card: IDCard): void => {
    const cards = getIDCards();
    const index = cards.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      cards[index] = card;
      setStoredData(STORAGE_KEYS.ID_CARDS, cards);
    }
  };

  // -------------------------------------------------------------
  // MAINTENANCE REQUESTS
  // -------------------------------------------------------------
  const getMaintenanceRequests = (estateId?: string): MaintenanceRequest[] => {
    const reqs = getStoredData<MaintenanceRequest[]>(STORAGE_KEYS.MAINTENANCE, []);
    if (estateId) return reqs.filter((m) => m.estateId === estateId);
    return reqs;
  };

  const createMaintenanceRequest = (req: MaintenanceRequest): void => {
    const reqs = getMaintenanceRequests();
    setStoredData(STORAGE_KEYS.MAINTENANCE, [req, ...reqs]);
  };

  const updateMaintenanceRequest = (req: MaintenanceRequest): void => {
    const reqs = getMaintenanceRequests();
    const index = reqs.findIndex((m) => m.id === req.id);
    if (index >= 0) {
      reqs[index] = req;
      setStoredData(STORAGE_KEYS.MAINTENANCE, reqs);
    }
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS & AUDIT LOGS
  // -------------------------------------------------------------
  const getNotifications = (role?: Role, userId?: string): Notification[] => {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS || []);
    if (!role) return notifs;
    return notifs.filter((n) => {
      if (n.targetRole && n.targetRole !== 'all' && n.targetRole !== role) return false;
      if (n.targetUserId && userId && n.targetUserId !== userId) return false;
      return true;
    });
  };

  const createNotification = (notif: Notification): void => {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS || []);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, [notif, ...notifs]);
  };

  const markNotificationRead = (id: string): void => {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS || []);
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  };

  const getAuditLogs = (estateId?: string): AuditLog[] => {
    const logs = getStoredData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS || []);
    if (estateId) return logs.filter((l) => l.estateId === estateId);
    return logs;
  };

  const addAuditLog = (log: AuditLog): void => {
    const logs = getStoredData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS || []);
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, [log, ...logs]);
  };

  const logAudit = (log: any): void => {
    addAuditLog({
      id: log.id || `aud-${Date.now()}`,
      estateId: log.estateId || 'estate-unity-abuja',
      action: log.action || 'ACTION',
      actorRole: log.actorRole || 'phdl_admin',
      actorId: log.actorId || 'system',
      actorName: log.actorName || 'System Actor',
      targetEntity: log.targetEntity || log.entityAffected || 'General',
      targetEntityId: log.targetEntityId || log.entityId,
      details: log.details || '',
      status: log.status || 'approved',
      timestamp: log.timestamp || new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // SERVICE TARIFF & LEVY SETTINGS
  // -------------------------------------------------------------
  const getTariffSettings = (): ServiceTariffSettings => {
    return getStoredData<ServiceTariffSettings>(STORAGE_KEYS.TARIFF_SETTINGS, DEFAULT_SERVICE_TARIFF);
  };

  const updateTariffSettings = (settings: ServiceTariffSettings, remarks?: string): void => {
    setStoredData(STORAGE_KEYS.TARIFF_SETTINGS, settings);
    if (remarks) {
      addAuditLog({
        id: `aud-${Date.now()}`,
        estateId: settings.estateId,
        action: 'TARIFF_UPDATE',
        actorRole: 'phdl_admin',
        actorId: 'admin-1',
        actorName: 'PHDL SuperAdmin',
        targetEntity: 'ServiceTariff',
        targetEntityId: settings.estateId,
        details: `Updated Service Tariff: ₦${(settings.standardMonthlyRate || settings.monthlyRate || 10000).toLocaleString()}/mo. Justification: ${remarks}`,
        status: 'approved',
        timestamp: new Date().toISOString(),
      });
    }
  };

  // -------------------------------------------------------------
  // PAYMENT GATEWAY & SMS GATEWAY SETTINGS
  // -------------------------------------------------------------
  const getPaymentGatewaySettings = (): PaymentGatewaySettings => {
    return getStoredData<PaymentGatewaySettings>(STORAGE_KEYS.PAYMENT_GATEWAY_SETTINGS, DEFAULT_PAYMENT_GATEWAY_SETTINGS);
  };

  const updatePaymentGatewaySettings = (settings: PaymentGatewaySettings): void => {
    setStoredData(STORAGE_KEYS.PAYMENT_GATEWAY_SETTINGS, settings);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'GATEWAY_UPDATE',
      actorRole: 'phdl_admin',
      actorId: 'admin-1',
      actorName: 'PHDL SuperAdmin',
      targetEntity: 'PaymentGateway',
      targetEntityId: settings.activeGateway,
      details: `Updated Payment Gateway credentials for ${settings.activeGateway.toUpperCase()} (Environment: ${settings.environment.toUpperCase()})`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  const getBroadcastSmsSettings = (): BroadcastSmsSettings => {
    return getStoredData<BroadcastSmsSettings>(STORAGE_KEYS.BROADCAST_SMS_SETTINGS, DEFAULT_BROADCAST_SMS_SETTINGS);
  };

  const updateBroadcastSmsSettings = (settings: BroadcastSmsSettings): void => {
    setStoredData(STORAGE_KEYS.BROADCAST_SMS_SETTINGS, settings);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'SMS_GATEWAY_UPDATE',
      actorRole: 'phdl_admin',
      actorId: 'admin-1',
      actorName: 'PHDL SuperAdmin',
      targetEntity: 'SMSGateway',
      targetEntityId: settings.primaryProvider,
      details: `Updated SMS Gateway API configuration for ${settings.primaryProvider.toUpperCase()} (Sender ID: ${settings.senderId})`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // USER PROFILES & AVATARS
  // -------------------------------------------------------------
  const getCurrentUserProfile = (): UserProfileData => {
    const role = getActiveRole();
    if (role === 'soldier') {
      const s = getSoldierById(getActiveSoldierId()) || getSoldiers()[0];
      const flat = getFlats().find((f) => (s?.ownedFlatIds || []).includes(f.id));
      const lane = getLaneById(flat?.laneId || '');
      return {
        id: s?.id || 'soldier-1',
        role: 'soldier',
        fullName: s?.fullName || 'Staff Sgt. Adamu Mohammed',
        email: s?.email || 'a.mohammed@army.mil.ng',
        phone: s?.phone || '+234 803 000 0001',
        serviceNumber: s?.serviceNumber || 'NA/2014/1042',
        rank: s?.rank || 'Staff Sergeant',
        militaryBranch: s?.militaryBranch || 'Nigerian Army',
        unitBrigade: s?.unitBrigade || 'Army Headquarters Garrison, Mogadishu Cantonment, Abuja',
        avatarUrl: s?.avatarUrl || '',
        flatCode: flat?.fullFlatCode,
        laneName: lane?.name,
        smsAlertsEnabled: true,
        inAppAlertsEnabled: true,
        whatsappAlertsEnabled: true,
      };
    } else if (role === 'tenant') {
      const t = getTenantById(getActiveTenantId()) || getTenants()[0];
      const flat = getFlatById(t?.flatId || '');
      const lane = getLaneById(flat?.laneId || '');
      const savedAvatar = getStoredData<string>(`phdl_tenant_avatar_${t?.id || 'tenant-1'}`, '');
      return {
        id: t?.id || 'tenant-1',
        role: 'tenant',
        fullName: t?.fullName || 'Emeka Gabriel Okon',
        email: t?.email || 'emeka.okon@gmail.com',
        phone: t?.phone || '+234 803 123 4567',
        occupation: t?.occupation || 'Civilian Resident',
        employer: t?.employer || 'Private Sector',
        avatarUrl: savedAvatar,
        flatCode: flat?.fullFlatCode,
        laneName: lane?.name,
        emergencyContactName: t?.emergencyContact?.name,
        emergencyContactPhone: t?.emergencyContact?.phone,
        emergencyContactRelationship: t?.emergencyContact?.relationship,
        smsAlertsEnabled: true,
        inAppAlertsEnabled: true,
        whatsappAlertsEnabled: true,
      };
    } else {
      return getStoredData<UserProfileData>(STORAGE_KEYS.ADMIN_PROFILE, {
        id: 'admin-1',
        role: 'phdl_admin',
        fullName: 'Col. Farouk Danjuma (Rtd.)',
        email: 'commandant.hq@phdl.gov.ng',
        phone: '+234 803 999 0001',
        rank: 'Colonel',
        militaryBranch: 'Nigerian Army',
        unitBrigade: 'PHDL Headquarters Abuja, RC 676563',
        avatarUrl: '/phdl-logo.png',
        smsAlertsEnabled: true,
        inAppAlertsEnabled: true,
        whatsappAlertsEnabled: true,
      });
    }
  };

  const updateCurrentUserProfile = (profile: UserProfileData): void => {
    if (profile.role === 'soldier') {
      const soldier = getSoldierById(profile.id);
      if (soldier) {
        soldier.fullName = profile.fullName;
        soldier.phone = profile.phone;
        soldier.email = profile.email;
        if (profile.unitBrigade) soldier.unitBrigade = profile.unitBrigade;
        if (profile.avatarUrl !== undefined) soldier.avatarUrl = profile.avatarUrl;
        updateSoldier(soldier);
      }
    } else if (profile.role === 'tenant') {
      const tenant = getTenantById(profile.id);
      if (tenant) {
        tenant.fullName = profile.fullName;
        tenant.phone = profile.phone;
        tenant.email = profile.email;
        if (profile.occupation) tenant.occupation = profile.occupation;
        if (profile.employer) tenant.employer = profile.employer;
        if (profile.emergencyContactName) {
          tenant.emergencyContact = {
            name: profile.emergencyContactName,
            phone: profile.emergencyContactPhone || '',
            relationship: profile.emergencyContactRelationship || 'Next of Kin',
          };
        }
        updateTenant(tenant);
      }
      if (profile.avatarUrl !== undefined) {
        setStoredData(`phdl_tenant_avatar_${profile.id}`, profile.avatarUrl);
      }
    } else {
      setStoredData(STORAGE_KEYS.ADMIN_PROFILE, profile);
    }
  };

  // -------------------------------------------------------------
  // ADMIN PERSONNEL & PRIVILEGE MANAGEMENT
  // -------------------------------------------------------------
  const getAdminUsers = (): AdminUser[] => {
    return getStoredData<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
  };

  const updateAdminUser = (admin: AdminUser): void => {
    const admins = getAdminUsers();
    const index = admins.findIndex((a) => a.id === admin.id || a.adminId === admin.adminId);
    if (index >= 0) {
      admins[index] = admin;
      setStoredData(STORAGE_KEYS.ADMIN_USERS, [...admins]);
    } else {
      setStoredData(STORAGE_KEYS.ADMIN_USERS, [admin, ...admins]);
    }
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'ADMIN_PRIVILEGE_MODIFIED',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'AdminUser',
      targetEntityId: admin.adminId,
      details: `Updated administrative privileges & role clearance for ${admin.rank || ''} ${admin.fullName} (${admin.adminId})`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  const addAdminUser = (admin: AdminUser): void => {
    const admins = getAdminUsers();
    setStoredData(STORAGE_KEYS.ADMIN_USERS, [admin, ...admins]);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'ADMIN_USER_CREATED',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'AdminUser',
      targetEntityId: admin.adminId,
      details: `Commissioned new Administrative Officer: ${admin.rank || ''} ${admin.fullName} (${admin.roleTitle})`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // ESTATE PREFERENCES & SLA
  // -------------------------------------------------------------
  const getEstatePreferences = (): EstatePreferencesAndSLA => {
    return getStoredData<EstatePreferencesAndSLA>(STORAGE_KEYS.ESTATE_PREFERENCES_SLA, DEFAULT_ESTATE_PREFERENCES_SLA);
  };

  const updateEstatePreferences = (prefs: EstatePreferencesAndSLA): void => {
    const updated = {
      ...prefs,
      lastUpdatedBy: 'Col. Farouk Danjuma (Rtd.)',
      lastUpdatedAt: new Date().toISOString(),
    };
    setStoredData(STORAGE_KEYS.ESTATE_PREFERENCES_SLA, updated);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: prefs.estateId,
      action: 'ESTATE_PREFERENCES_UPDATE',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'EstatePreferencesAndSLA',
      targetEntityId: prefs.estateId,
      details: `Updated Estate Preferences & SLA parameters (Emergency SLA: ${prefs.emergencySlaHours}h, Curfew: ${prefs.visitorCurfewTime})`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // MULTI-CHANNEL BROADCASTS
  // -------------------------------------------------------------
  const broadcastEmail = (payload: EmailBroadcastPayload): void => {
    const history = getStoredData<any[]>(STORAGE_KEYS.BROADCAST_HISTORY, []);
    setStoredData(STORAGE_KEYS.BROADCAST_HISTORY, [{ ...payload, channel: 'email', status: 'delivered' }, ...history]);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'BROADCAST_EMAIL_DISPATCH',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'EmailBroadcast',
      targetEntityId: payload.id,
      details: `Dispatched Official Email Broadcast: "${payload.subject}" to ${payload.recipientCount} recipients`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  const broadcastSms = (payload: SmsBroadcastPayload): void => {
    const history = getStoredData<any[]>(STORAGE_KEYS.BROADCAST_HISTORY, []);
    setStoredData(STORAGE_KEYS.BROADCAST_HISTORY, [{ ...payload, channel: 'sms', status: 'delivered' }, ...history]);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'BROADCAST_SMS_DISPATCH',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'BulkSmsBroadcast',
      targetEntityId: payload.id,
      details: `Dispatched Bulk SMS via ${payload.provider.toUpperCase()} (${payload.senderId}) to ${payload.recipientCount} phones (${payload.gsmSegments} segments)`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  const broadcastPush = (payload: PushBroadcastPayload): void => {
    const history = getStoredData<any[]>(STORAGE_KEYS.BROADCAST_HISTORY, []);
    setStoredData(STORAGE_KEYS.BROADCAST_HISTORY, [{ ...payload, channel: 'push', status: 'broadcasted' }, ...history]);
    createNotification({
      id: `notif-push-${Date.now()}`,
      targetRole: payload.targetRole,
      title: payload.title,
      message: payload.message,
      type: 'alert',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  };

  const getBroadcastHistory = (): any[] => {
    return getStoredData<any[]>(STORAGE_KEYS.BROADCAST_HISTORY, [
      {
        id: 'hist-01',
        channel: 'sms',
        senderId: 'PHDL-ESTATE',
        messageText: 'PHDL Unity Estate Notice: Mandatory routine estate perimeter security patrol commencing at 23:00. Please ensure visitors are checked out.',
        recipientsAudience: 'all_residents',
        recipientCount: 404,
        sentAt: '2026-08-28T21:00:00Z',
        provider: 'termii',
        status: 'delivered',
      },
      {
        id: 'hist-02',
        channel: 'email',
        subject: 'COMMAND DIRECTIVE: Q3 Service Charge & Central Generator Schedule',
        senderName: 'Col. Farouk Danjuma (Rtd.)',
        senderEmail: 'commandant.hq@phdl.gov.ng',
        recipientsAudience: 'all_residents',
        recipientCount: 398,
        sentAt: '2026-08-25T10:30:00Z',
        status: 'delivered',
      },
    ]);
  };

  // --- FLAT CRUD ---
  const addFlat = (flat: Flat): void => {
    const flats = getFlats();
    setStoredData(STORAGE_KEYS.FLATS, [flat, ...flats]);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: flat.estateId,
      action: 'FLAT_CREATED',
      actorRole: 'phdl_admin',
      actorId: 'ADM-HQ-001',
      actorName: 'Col. Farouk Danjuma (Rtd.)',
      targetEntity: 'Flat',
      targetEntityId: flat.id,
      details: `Created new Housing Unit: Flat ${flat.fullFlatCode}`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  const deleteFlat = (flatId: string): void => {
    const flats = getFlats().filter((f) => f.id !== flatId);
    setStoredData(STORAGE_KEYS.FLATS, flats);
  };

  // --- SOLDIER CRUD ---
  const deleteSoldier = (soldierId: string): void => {
    const soldiers = getSoldiers().filter((s) => s.id !== soldierId);
    setStoredData(STORAGE_KEYS.SOLDIERS, soldiers);
  };

  // --- TENANT CRUD ---
  const deleteTenant = (tenantId: string): void => {
    const tenants = getTenants().filter((t) => t.id !== tenantId);
    setStoredData(STORAGE_KEYS.TENANTS, tenants);
  };

  // --- SUPERADMIN DIGITAL SIGNATURE ---
  const getSuperAdminSignature = (): SuperAdminSignature => {
    return getStoredData<SuperAdminSignature>('phdl_admin_signature_v7', {
      adminId: 'ADM-HQ-001',
      fullName: 'Col. Farouk Danjuma (Rtd.)',
      rank: 'Colonel',
      signatureImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60"><path d="M10,40 Q30,10 60,30 T110,25 T150,35" fill="none" stroke="%231B4D21" stroke-width="2.5" stroke-linecap="round"/><circle cx="140" cy="20" r="3" fill="%23991B1B"/></svg>',
      officialStampTitle: 'COMMANDANT & MANAGING DIRECTOR, PHDL HQ RC 676563',
      authorizedAt: new Date().toISOString(),
    });
  };

  const updateSuperAdminSignature = (signature: SuperAdminSignature): void => {
    setStoredData('phdl_admin_signature_v7', signature);
    addAuditLog({
      id: `aud-${Date.now()}`,
      estateId: 'estate-unity-abuja',
      action: 'SIGNATURE_UPDATE',
      actorRole: 'phdl_admin',
      actorId: signature.adminId,
      actorName: signature.fullName,
      targetEntity: 'AdminSignature',
      targetEntityId: signature.adminId,
      details: `Updated SuperAdmin Digital Signature & Stamp for document verification`,
      status: 'approved',
      timestamp: new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // ACTIVE SESSION SWITCHERS
  // -------------------------------------------------------------
  const getActiveRole = (): Role => {
    return getStoredData<Role>(STORAGE_KEYS.ACTIVE_ROLE, 'phdl_admin');
  };

  const setActiveRole = (role: Role): void => {
    setStoredData(STORAGE_KEYS.ACTIVE_ROLE, role);
  };

  const getActiveEstateId = (): string => {
    return getStoredData<string>(STORAGE_KEYS.ACTIVE_ESTATE_ID, 'estate-unity-abuja');
  };

  const setActiveEstateId = (id: string): void => {
    setStoredData(STORAGE_KEYS.ACTIVE_ESTATE_ID, id);
  };

  const getActiveSoldierId = (): string => {
    return getStoredData<string>(STORAGE_KEYS.ACTIVE_SOLDIER_ID, 'soldier-1');
  };

  const setActiveSoldierId = (id: string): void => {
    setStoredData(STORAGE_KEYS.ACTIVE_SOLDIER_ID, id);
  };

  const getActiveTenantId = (): string => {
    return getStoredData<string>(STORAGE_KEYS.ACTIVE_TENANT_ID, 'tenant-1');
  };

  const setActiveTenantId = (id: string): void => {
    setStoredData(STORAGE_KEYS.ACTIVE_TENANT_ID, id);
  };

  // -------------------------------------------------------------
  // CRON & BACKGROUND ENGINE
  // -------------------------------------------------------------
  const evaluateRentAndLevyCron = (): number => {
    const flats = getFlats('estate-unity-abuja');
    const bills = getBills('estate-unity-abuja');
    let createdCount = 0;

    flats.forEach((flat) => {
      if (flat.currentTenantId && flat.rentExpiryDate) {
        const expiryDate = new Date(flat.rentExpiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 60 && diffDays > 0) {
          const exists = bills.some((b) => b.flatId === flat.id && b.billType === 'rent_reminder' && b.status === 'unpaid');
          if (!exists) {
            createBill({
              id: `bill-auto-rent-${flat.id}-${Date.now()}`,
              estateId: flat.estateId,
              flatId: flat.id,
              tenantId: flat.currentTenantId,
              billType: 'rent_reminder',
              title: `Annual Rent Expiry Reminder (${diffDays} Days Remaining)`,
              amount: flat.rentAmount || 1200000,
              totalAmount: flat.rentAmount || 1200000,
              dueDate: flat.rentExpiryDate,
              status: 'unpaid',
              createdAt: new Date().toISOString(),
            });
            createdCount++;
          }
        }
      }
    });

    return createdCount;
  };

  const resetToCleanDefaults = (): void => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.ESTATES, JSON.stringify(INITIAL_ESTATES || []));
    localStorage.setItem(STORAGE_KEYS.LANES, JSON.stringify(INITIAL_LANES || []));
    localStorage.setItem(STORAGE_KEYS.FLATS, JSON.stringify(INITIAL_FLATS || []));
    localStorage.setItem(STORAGE_KEYS.SOLDIERS, JSON.stringify(INITIAL_SOLDIERS || []));
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS || []));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS || []));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS || []));
    localStorage.setItem(STORAGE_KEYS.ID_CARDS, JSON.stringify(INITIAL_ID_CARDS || []));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS || []));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS || []));
    localStorage.setItem(STORAGE_KEYS.TARIFF_SETTINGS, JSON.stringify(DEFAULT_SERVICE_TARIFF));
    localStorage.setItem(STORAGE_KEYS.PAYMENT_GATEWAY_SETTINGS, JSON.stringify(DEFAULT_PAYMENT_GATEWAY_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.BROADCAST_SMS_SETTINGS, JSON.stringify(DEFAULT_BROADCAST_SMS_SETTINGS));
  };

  return {
    getEstates,
    getEstateById,
    getLanes,
    getLaneById,
    getFlats,
    getFlatById,
    updateFlat,
    getSoldiers,
    getSoldierById,
    addSoldier,
    updateSoldier,
    getTenants,
    getTenantById,
    addTenant,
    updateTenant,
    getDependents,
    addDependent,
    removeDependent,
    getLeases,
    getLeaseById,
    getBills,
    getBillById,
    createBill,
    updateBill,
    getPayments,
    recordPayment,
    getIDCards,
    getIDCardById,
    issueIDCard,
    updateIDCard,
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    getNotifications,
    createNotification,
    addNotification: (notif: any) => {
      const notifs = getStoredData<any[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS || []);
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, [notif, ...notifs]);
    },
    markNotificationRead,
    getAnnouncements: (_estateId?: string) => [],
    broadcastAnnouncement: (_ann: any) => {},
    runSchedulerCycle: () => 0,
    generateBulkServiceChargeInvoices: (_period?: any) => 0,
    addBill: createBill,
    getAuditLogs,
    addAuditLog,
    logAudit,
    getTariffSettings,
    updateTariffSettings,
    getServiceChargeConfig: getTariffSettings,
    updateServiceChargeConfig: updateTariffSettings,
    getPaymentGatewaySettings,
    updatePaymentGatewaySettings,
    testGatewayConnection: async (_gw?: string) => true,
    getBroadcastSmsSettings,
    updateBroadcastSmsSettings,
    sendTestSms: async (_provider?: string, _phone?: string) => ({ success: true, messageId: `msg-${Date.now()}` }),
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getActiveRole,
    setActiveRole,
    getActiveEstateId,
    setActiveEstateId,
    getActiveSoldierId,
    setActiveSoldierId,
    getActiveTenantId,
    setActiveTenantId,
    addFlat,
    bulkAddFlats: (newFlats: any[]) => {
      const current = getStoredData<any[]>(STORAGE_KEYS.FLATS, INITIAL_FLATS || []);
      setStoredData(STORAGE_KEYS.FLATS, [...current, ...newFlats]);
    },
    updateFlatAllocation: (arg1: any, soldierId?: string, tenantId?: string) => {
      const current = getStoredData<any[]>(STORAGE_KEYS.FLATS, INITIAL_FLATS || []);
      if (typeof arg1 === 'object' && arg1 !== null) {
        const payload = arg1;
        const updated = current.map((f) => {
          if (f.id === payload.flatId) {
            return {
              ...f,
              status: payload.status || f.status,
              meterNumber: payload.meterNumber !== undefined ? payload.meterNumber : f.meterNumber,
            };
          }
          return f;
        });
        setStoredData(STORAGE_KEYS.FLATS, updated);
      } else {
        const flatId = arg1;
        const updated = current.map((f) => {
          if (f.id === flatId) {
            return {
              ...f,
              ownerId: soldierId !== undefined ? soldierId : f.ownerId,
              currentTenantId: tenantId !== undefined ? tenantId : f.currentTenantId,
              status: soldierId ? (tenantId ? 'sublet' : 'owner_occupied') : 'unoccupied',
            };
          }
          return f;
        });
        setStoredData(STORAGE_KEYS.FLATS, updated);
      }
    },
    deleteFlat,
    deleteSoldier,
    deleteTenant,
    getSuperAdminSignature,
    updateSuperAdminSignature,
    getAdminUsers,
    updateAdminUser,
    addAdminUser,
    getEstatePreferences,
    updateEstatePreferences,
    broadcastEmail,
    broadcastSms,
    broadcastPush,
    getBroadcastHistory,
    evaluateRentAndLevyCron,
    resetToCleanDefaults,
  };
};