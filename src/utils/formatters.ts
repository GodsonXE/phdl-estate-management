export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getDaysRemaining = (targetDateStr: string): number => {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export interface RentCycleInfo {
  daysRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  cycleLabel: string;
  badgeLabel: string;
  badgeClass: string;
  progressPercent: number;
}

export const getRentCycleDetails = (leaseStartStr?: string, leaseEndStr?: string): RentCycleInfo => {
  const startStr = leaseStartStr || '2025-10-01';
  const endStr = leaseEndStr || '2026-09-30';

  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const now = Date.now();

  const totalDurationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDurationDays) * 100)));

  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 60;

  let badgeLabel = `${daysRemaining} days left`;
  let badgeClass = 'badge-success';

  if (isExpired) {
    badgeLabel = `Expired (${Math.abs(daysRemaining)}d ago)`;
    badgeClass = 'badge-danger';
  } else if (isExpiringSoon) {
    badgeLabel = `Expires in ${daysRemaining}d`;
    badgeClass = 'badge-warning';
  }

  const cycleLabel = `${formatDate(startStr)} – ${formatDate(endStr)}`;

  return {
    daysRemaining,
    isExpired,
    isExpiringSoon,
    cycleLabel,
    badgeLabel,
    badgeClass,
    progressPercent,
  };
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'owner_occupied':
    case 'active':
    case 'paid':
    case 'verified':
    case 'resolved':
    case 'successful':
      return 'badge-success';

    case 'sublet':
    case 'in_progress':
    case 'partially_paid':
    case 'assigned':
    case 'expiring_soon':
      return 'badge-warning';

    case 'unoccupied':
      return 'badge-neutral';

    case 'vacant':
    case 'submitted':
    case 'pending':
    case 'pending_verification':
    case 'in_review':
      return 'badge-info';

    case 'under_maintenance':
    case 'overdue':
    case 'expired':
    case 'terminated':
    case 'rejected':
    case 'suspended':
    case 'revoked':
    case 'emergency':
    case 'failed':
      return 'badge-danger';

    default:
      return 'badge-neutral';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'owner_occupied':
      return 'Owner-Occupied';
    case 'sublet':
      return 'Sublet to Tenant';
    case 'unoccupied':
      return 'Unoccupied (Empty)';
    case 'vacant':
      return 'Vacant (Available)';
    case 'under_maintenance':
      return 'Under Maintenance';
    case 'pending_verification':
      return 'Pending Verification';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    case 'partially_paid':
      return 'Partially Paid';
    case 'in_progress':
      return 'In Progress';
    case 'expiring_soon':
      return 'Expiring Soon';
    case 'phdl_estate_manager':
      return 'PHDL Management';
    case 'landlord':
      return 'Soldier Landlord';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }
};

export const getBillTypeLabel = (billType: string): string => {
  switch (billType) {
    case 'service_charge':
      return 'Estate Service Charge';
    case 'power_electricity':
      return 'Electricity Tariff';
    case 'water_rate':
      return 'Water Supply Levy';
    case 'security_levy':
      return 'Perimeter Security Levy';
    case 'facility_maintenance':
      return 'Facility Maintenance';
    case 'estate_id_fee':
      return 'Smart Estate ID Fee';
    default:
      return billType.replace(/_/g, ' ').toUpperCase();
  }
};
