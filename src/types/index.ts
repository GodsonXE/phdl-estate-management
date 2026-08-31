export type Role = 'phdl_admin' | 'soldier' | 'tenant';

export type MilitaryBranch = 'Nigerian Army' | 'Nigerian Navy' | 'Nigerian Air Force' | 'Defence Headquarters' | (string & {});

export type MilitaryRank =
  | 'General'
  | 'Lt. General'
  | 'Major General'
  | 'Brigadier General'
  | 'Colonel'
  | 'Lt. Colonel'
  | 'Major'
  | 'Captain'
  | 'Lieutenant'
  | 'Second Lieutenant'
  | 'Master Warrant Officer'
  | 'Warrant Officer'
  | 'Staff Sergeant'
  | 'Sergeant'
  | 'Corporal'
  | 'Lance Corporal'
  | 'Private';

export type FlatStatus = 'occupied' | 'sublet' | 'unoccupied' | 'owner_occupied' | 'vacant' | 'under_maintenance' | (string & {});

export type UnitLabel = 'A' | 'B' | 'C' | 'D' | (string & {});
export type IDCardHolderType = 'soldier' | 'tenant' | 'dependent' | 'visitor';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'structural' | 'security' | 'waste' | 'structural_roofing' | 'civil_drainage' | 'water_supply' | (string & {});
export type MaintenanceSeverity = 'low' | 'medium' | 'high' | 'emergency' | (string & {});
export type MaintenanceRouting = 'artisan' | 'contractor' | 'hq' | 'estate_manager' | 'landlord' | 'phdl_estate_manager' | (string & {});
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'submitted' | 'resolved' | 'closed' | (string & {});
export type BillPayerRole = 'tenant' | 'owner' | 'split' | 'phdl_admin' | (string & {});
export type BillType = 'service_charge' | 'rent_reminder' | 'infrastructure_levy' | 'security_levy' | (string & {});

export interface Announcement {
  id: string;
  estateId: string;
  title: string;
  message: string;
  scope?: string;
  targetRole?: string;
  targetLaneId?: string;
  urgency?: string;
  broadcastViaSms?: boolean;
  broadcastViaInApp?: boolean;
  broadcastViaWhatsApp?: boolean;
  authorName?: string;
  senderName?: string;
  senderRole?: string;
  channels?: string[];
  deliveryStatus?: {
    inAppCount?: number;
    smsSentCount?: number;
    emailSentCount?: number;
  };
  createdAt: string;
}

export interface Building {
  id: string;
  laneId: string;
  estateId: string;
  buildingNumber: number;
  blockLabel?: string;
  totalFloors?: number;
  flatIds?: string[];
}

export interface Estate {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zone?: string;
  totalFlats: number;
  lanesCount?: number;
  totalLanes?: number;
  totalBuildings?: number;
  establishedYear?: number;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
}

export interface Lane {
  id: string;
  estateId: string;
  laneNumber: number;
  name: string;
  blockCount?: number;
  totalBuildings?: number;
}

export interface Flat {
  id: string;
  estateId: string;
  laneId: string;
  houseNumber?: number;
  flatLetter?: 'A' | 'B' | 'C' | 'D' | string;
  fullFlatCode: string;
  flatType: '2-Bedroom Standard' | '2_bedroom_flat' | '3_bedroom_flat' | (string & {});
  status: FlatStatus;
  ownerId?: string;
  currentTenantId?: string;
  rentAmount?: number;
  rentDate?: string;
  rentExpiryDate?: string;
  isAvailableForSublet?: boolean;
  subletAskingRent?: number;
  floor?: string;
  meterNumber?: string;
  unitLabel?: UnitLabel;
  buildingId?: string;
}

export interface Soldier {
  id: string;
  serviceNumber: string;
  militaryBranch: MilitaryBranch;
  rank: MilitaryRank;
  fullName: string;
  phone: string;
  email: string;
  unitBrigade: string;
  avatarUrl?: string;
  ownedFlatIds: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified' | 'pending_verification' | 'rejected';
  verifiedAt?: string;
  idCardNumber?: string;
  createdAt?: string;
}

export interface Dependent {
  id: string;
  fullName: string;
  relationship: string;
  age: number;
  gender: 'male' | 'female' | 'Male' | 'Female';
  linkedToId?: string;
  idCardNumber?: string;
}

export interface Tenant {
  id: string;
  estateId?: string;
  fullName: string;
  phone: string;
  email: string;
  flatId: string;
  landlordId?: string;
  landlordNameUnverified?: string;
  occupation: string;
  employer?: string;
  status?: 'active' | 'inactive' | 'pending' | 'evicted';
  rentFrequency?: string;
  rentStartDate?: string;
  rentExpiryDate?: string;
  rentPaymentDate?: string;
  annualRentAmount?: number;
  rentAmount?: number;
  leaseStart?: string;
  leaseEnd?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhone?: string;
  dependentsCount?: number;
  dependents?: Dependent[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  onboardingComplete?: boolean;
  profileIncomplete?: boolean;
  idCardNumber?: string;
  createdAt?: string;
}

export interface LeaseAgreement {
  id: string;
  estateId?: string;
  tenantId: string;
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  flatId: string;
  flatCode?: string;
  landlordId?: string;
  landlordName?: string;
  landlordPhone?: string;
  rentAmount: number;
  paymentFrequency?: string;
  securityDeposit?: number;
  leaseStart?: string;
  leaseEnd?: string;
  startDate?: string;
  endDate?: string;
  signedDate?: string;
  isOwnerAcknowledged?: boolean;
  isPHDLApproved?: boolean;
  approvedDate?: string;
  approvedBy?: string;
  terms?: string;
  status: 'active' | 'expired' | 'terminated';
  agreementDocName?: string;
  agreementDocUrl?: string;
}

export interface TariffItem {
  id: string;
  estateId: string;
  title: string;
  category: 'service_charge' | 'security_levy' | 'infrastructure_levy' | 'waste_management' | 'special_assessment';
  monthlyRate: number;
  permittedMultipliers: number[];
  threeMonthsRate: number;
  sixMonthsRate: number;
  annualRate: number;
  status: 'active' | 'cancelled' | 'pending_validation';
  validatedBy?: string;
  validatedAdminId?: string;
  validatedDate?: string;
  remarks?: string;
}

export interface ServiceTariffSettings {
  estateId: string;
  standardMonthlyRate?: number;
  monthlyRate?: number;
  threeMonthsAmount?: number;
  sixMonthsAmount?: number;
  annualAmount?: number;
  permittedBulkMultipliers?: number[];
  activeBulkCharges?: {
    threeMonths: number;
    sixMonths: number;
    annual: number;
  };
  tariffsList?: TariffItem[];
  history?: any[];
  lastUpdatedDate?: string;
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
  remarks: string;
}

export type ServiceChargeConfig = ServiceTariffSettings;

export interface Bill {
  id: string;
  estateId: string;
  flatId: string;
  laneId?: string;
  tenantId?: string;
  soldierId?: string;
  billType: 'service_charge' | 'rent_reminder' | 'infrastructure_levy' | 'security_levy' | (string & {});
  title: string;
  description?: string;
  amount?: number;
  totalAmount?: number;
  ownerPortion?: number;
  tenantPortion?: number;
  ownerPaidAmount?: number;
  tenantPaidAmount?: number;
  payerRole?: string;
  invoiceNumber?: string;
  billingPeriod?: string;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  paidAmount?: number;
  paymentReference?: string;
  billingPeriodMonths?: 3 | 6 | 12;
  approvedByAdminId?: string;
  approvedByAdminName?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  estateId: string;
  billId?: string;
  payerId: string;
  payerRole: Role;
  payerName: string;
  amount?: number;
  amountPaid?: number;
  paymentType?: string;
  paymentDate?: string;
  flatId?: string;
  notes?: string;
  transactionReference?: string;
  paymentMethod: 'paystack' | 'flutterwave' | 'bank_transfer' | string;
  reference?: string;
  status: 'success' | 'failed' | 'pending';
  paidAt?: string;
  receiptNumber: string;
}

export interface IDCard {
  id: string;
  estateId: string;
  holderType: IDCardHolderType;
  holderId: string;
  holderName: string;
  holderRoleOrRank: string;
  flatCode: string;
  laneName: string;
  cardNumber: string;
  qrData: string;
  photoUrl?: string;
  bloodGroup?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'suspended' | 'revoked';
  emergencyContact?: string;
}

export interface MaintenanceRequest {
  id: string;
  estateId: string;
  flatId: string;
  laneId?: string;
  flatCode?: string;
  ticketNumber?: string;
  requesterId?: string;
  requesterRole?: Role;
  requesterName?: string;
  raisedById?: string;
  raisedByRole?: string;
  raisedByName?: string;
  raisedByPhone?: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  severity?: MaintenanceSeverity | string;
  routingTarget?: MaintenanceRouting | string;
  status: MaintenanceStatus;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  costEstimate?: number;
  resolutionNotes?: string;
  resolvedAt?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  targetRole?: Role | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'alert' | 'billing' | (string & {});
  createdAt: string;
}

export type SystemNotification = Notification & {
  recipientRole?: string;
  recipientId?: string;
  channel?: string;
};

export interface AuditLog {
  id: string;
  estateId: string;
  action: string;
  actorRole: Role;
  actorId: string;
  actorName: string;
  targetEntity?: string;
  targetEntityId?: string;
  entityAffected?: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  status?: 'approved' | 'rejected' | 'flagged' | 'logged';
  timestamp?: string;
  createdAt?: string;
}

export interface PaymentGatewaySettings {
  activeGateway: 'paystack' | 'flutterwave' | 'hybrid';
  environment: 'test' | 'live';
  paystack: {
    publicKey?: string;
    secretKey?: string;
    livePublicKey?: string;
    liveSecretKey?: string;
    testPublicKey?: string;
    testSecretKey?: string;
    merchantSubaccount?: string;
    webhookSecret: string;
    subaccountCode?: string;
    callbackUrl: string;
  };
  flutterwave: {
    publicKey?: string;
    secretKey?: string;
    livePublicKey?: string;
    liveSecretKey?: string;
    testPublicKey?: string;
    testSecretKey?: string;
    encryptionKey?: string;
    liveEncryptionKey?: string;
    webhookSecret: string;
    callbackUrl?: string;
  };
  hybridSplitRatio?: {
    paystackPercentage: number;
    flutterwavePercentage: number;
  };
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface BroadcastSmsSettings {
  primaryProvider: 'termii' | 'bulksmsnigeria' | 'bulksms_nigeria' | 'twilio' | 'africastalking';
  senderId: string;
  termii: {
    apiKey: string;
    baseUrl: string;
    channel: 'generic' | 'dnd' | 'whatsapp';
    senderId?: string;
  };
  bulkSmsNigeria: {
    apiToken: string;
    baseUrl: string;
    gateway: string;
    senderId?: string;
  };
  twilio?: any;
  africasTalking?: any;
  smartSmsSolutions?: any;
  routes?: {
    rentReminders: boolean;
    serviceChargeInvoices: boolean;
    emergencySecurityBroadcasts: boolean;
    gatePassClearanceOtp: boolean;
    maintenanceUpdates: boolean;
  };
  routingRules?: {
    rentExpiryAlerts?: boolean;
    serviceChargeBroadcasts?: boolean;
    emergencySecurityAlerts?: boolean;
    gatePassApprovals?: boolean;
    maintenanceUpdates?: boolean;
  };
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface AdminPrivilegeMap {
  canModifyFlats: boolean;
  canApproveKYC: boolean;
  canModifyTenants: boolean;
  canManageTariffs: boolean;
  canSendBulkSMS: boolean;
  canSendEmailBroadcast: boolean;
  canExportDocuments: boolean;
  canAssignPrivileges: boolean;
  canSignDocuments: boolean;
  canAccessAuditLogs: boolean;
}

export interface AdminUser {
  id: string;
  adminId: string;
  fullName: string;
  email: string;
  phone: string;
  rank: string;
  roleTitle: 'HQ SuperAdmin' | 'Estate Manager' | 'Security Gate Marshal' | 'Audit & Compliance Officer' | 'Billing & Revenue Officer' | string;
  laneClearance: 'All Lanes' | 'Lanes 1-4' | 'Lanes 5-8' | string;
  privileges: AdminPrivilegeMap | string[];
  signatureStampImage?: string;
  status: 'active' | 'suspended';
  lastActiveAt?: string;
  createdAt?: string;
}

export interface EstatePreferencesAndSLA {
  estateId: string;
  emergencySlaHours: number;
  highPrioritySlaHours: number;
  standardSlaHours: number;
  lowPrioritySlaHours: number;
  disputeResolutionSlaDays: number;
  gatePassApprovalSlaHours: number;
  residentGateAccess: string;
  visitorCurfewTime: string;
  contractorAccessWindow: string;
  nightPatrolIntervalMins: number;
  generatorMorningSchedule: string;
  generatorEveningSchedule: string;
  waterSupplyMorning: string;
  waterSupplyEvening: string;
  wasteEvacuationDays: string[];
  dumpingPenaltyFee: number;
  noiseRegulationCurfew: string;
  rentGracePeriodDays: number;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface SuperAdminSignature {
  adminId: string;
  fullName: string;
  rank: string;
  signatureImage: string; // Base64 Data URL (JPG/PNG) or SVG stamp
  officialStampTitle: string;
  authorizedAt: string;
  ipAddress?: string;
}

export interface EmailBroadcastPayload {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  recipientsAudience: 'all_residents' | 'all_soldiers' | 'all_tenants' | 'lane_specific';
  targetLaneId?: string;
  headerBannerTitle: string;
  emailBodyHtml: string;
  includeOfficialStamp: boolean;
  urgentBadge: boolean;
  sentAt: string;
  recipientCount: number;
}

export interface SmsBroadcastPayload {
  id: string;
  senderId: string;
  messageText: string;
  recipientsAudience: 'all_residents' | 'all_soldiers' | 'all_tenants' | 'lane_specific';
  targetLaneId?: string;
  dndOverride: boolean;
  gsmSegments: number;
  charCount: number;
  sentAt: string;
  recipientCount: number;
  provider: 'termii' | 'bulksmsnigeria';
}

export interface PushBroadcastPayload {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'high' | 'urgent_emergency';
  category: 'security_clearance' | 'maintenance_notice' | 'billing_alert' | 'command_directive';
  targetRole: Role | 'all';
  sentAt: string;
}

export interface UserProfileData {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  altPhone?: string;
  serviceNumber?: string;
  rank?: string;
  militaryBranch?: string;
  unitBrigade?: string;
  avatarUrl?: string;
  occupation?: string;
  employer?: string;
  flatCode?: string;
  laneName?: string;
  signatureUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  smsAlertsEnabled?: boolean;
  inAppAlertsEnabled?: boolean;
  whatsappAlertsEnabled?: boolean;
  notificationPreferences?: {
    sms: boolean;
    inApp: boolean;
    whatsapp: boolean;
    email: boolean;
  };
}