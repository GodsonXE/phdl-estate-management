import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { usePhdlStore } from './data/storage';
import { Role } from './types';
import { Sidebar, ActivePage } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';

// Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { SoldierDashboard } from './pages/dashboards/SoldierDashboard';
import { TenantDashboard } from './pages/dashboards/TenantDashboard';

// SuperAdmin HQ Modules
import { AdminApartmentAllocationsPage } from './pages/admin/AdminApartmentAllocationsPage';
import { SoldierOnboardingRegistryPage } from './pages/admin/SoldierOnboardingRegistryPage';
import { TenantManagementPage } from './pages/admin/TenantManagementPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { FlatManagementPage } from './pages/admin/FlatManagementPage';
import { EstateHierarchyPage } from './pages/admin/EstateHierarchyPage';
import { AdminTariffsManagementPage } from './pages/admin/AdminTariffsManagementPage';
import { BillingManagementPage } from './pages/billing/BillingManagementPage';
import { IDCardManagementPage } from './pages/idcards/IDCardManagementPage';
import { NotificationCenterPage } from './pages/admin/NotificationCenterPage';
import { MaintenancePage } from './pages/maintenance/MaintenancePage';
import { SystemSettingsPage } from './pages/settings/SystemSettingsPage';

// Soldier Modules
import { SoldierAllocationTrackerPage } from './pages/soldier/SoldierAllocationTrackerPage';
import { SoldierPropertiesPage } from './pages/soldier/SoldierPropertiesPage';
import { SoldierTenantsPage } from './pages/soldier/SoldierTenantsPage';
import { SoldierBillingPage } from './pages/soldier/SoldierBillingPage';
import { SoldierIDCardPage } from './pages/soldier/SoldierIDCardPage';

// Tenant Modules
import { TenantProfilePage } from './pages/tenant/TenantProfilePage';
import { TenantBillingPage } from './pages/tenant/TenantBillingPage';
import { TenantDependentsPage } from './pages/tenant/TenantDependentsPage';
import { TenantIDCardPage } from './pages/tenant/TenantIDCardPage';
import { UserProfilePage } from './pages/profile/UserProfilePage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackPage?: string;
  onReset?: () => void;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught module error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #FECACA', margin: '1rem 0' }}>
          <h2 style={{ color: '#991B1B', margin: '0 0 0.5rem' }}>Module Loading Notice</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            This page encountered a display issue. Click below to reload:
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn btn-primary btn-sm"
            style={{ backgroundColor: '#15803D', marginTop: '1rem' }}
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type ViewMode = 'landing' | 'auth' | 'app';

export const App: React.FC = () => {
  const store = usePhdlStore();
  const [activeRole, setActiveRole] = useState<Role>(() => store.getActiveRole());
  
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<Role>('phdl_admin');

  const getDefaultPageForRole = (role: Role): ActivePage => {
    if (role === 'soldier') return 'soldier_dashboard';
    if (role === 'tenant') return 'tenant_dashboard';
    return 'admin_dashboard';
  };

  const [currentPage, setCurrentPage] = useState<ActivePage>(() =>
    getDefaultPageForRole(store.getActiveRole())
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleRoleSwitch = (newRole: Role) => {
    store.setActiveRole(newRole);
    setActiveRole(newRole);
    setCurrentPage(getDefaultPageForRole(newRole));
  };

  const handleLoginSuccess = (role: Role) => {
    handleRoleSwitch(role);
    setViewMode('app');
  };

  const handleLogout = () => {
    setViewMode('landing');
  };

  const handleNavigateToAuth = (mode: 'login' | 'register', role?: Role) => {
    setAuthInitialMode(mode);
    if (role) setAuthInitialRole(role);
    setViewMode('auth');
  };

  const renderContent = () => {
    switch (currentPage) {
      // Admin HQ Tabs
      case 'admin_dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'admin_allocations':
        return <AdminApartmentAllocationsPage onNavigate={setCurrentPage} />;
      case 'soldier_onboarding':
      case 'admin_soldiers':
        return <SoldierOnboardingRegistryPage />;
      case 'admin_tenants':
        return <TenantManagementPage />;
      case 'admin_admins':
        return <AdminUsersPage />;
      case 'admin_flats':
        return <FlatManagementPage />;
      case 'admin_hierarchy':
        return <EstateHierarchyPage />;
      case 'admin_billing':
        return <AdminTariffsManagementPage />;
      case 'billing_mgmt':
        return <BillingManagementPage />;
      case 'admin_id_cards':
      case 'gate_scanner':
        return <IDCardManagementPage />;
      case 'notifications_scheduler':
        return <NotificationCenterPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'admin_settings':
      case 'system_settings':
        return <SystemSettingsPage />;

      // Soldier Landlord Tabs
      case 'soldier_dashboard':
        return <SoldierDashboard onNavigate={setCurrentPage} />;
      case 'soldier_allocations':
        return <SoldierAllocationTrackerPage />;
      case 'soldier_properties':
        return <SoldierPropertiesPage />;
      case 'soldier_tenants':
        return <SoldierTenantsPage />;
      case 'soldier_billing':
        return <SoldierBillingPage />;
      case 'soldier_id_card':
        return <SoldierIDCardPage />;
      case 'soldier_settings':
        return <UserProfilePage />;

      // Resident Tenant Tabs
      case 'tenant_dashboard':
        return <TenantDashboard onNavigate={setCurrentPage} />;
      case 'tenant_profile':
        return <TenantProfilePage />;
      case 'tenant_billing':
        return <TenantBillingPage />;
      case 'tenant_dependents':
        return <TenantDependentsPage />;
      case 'tenant_id_card':
        return <TenantIDCardPage />;
      case 'tenant_settings':
      case 'user_profile':
      case 'profile':
      case 'settings':
        return <UserProfilePage />;

      default:
        return activeRole === 'soldier' ? (
          <SoldierDashboard onNavigate={setCurrentPage} />
        ) : activeRole === 'tenant' ? (
          <TenantDashboard onNavigate={setCurrentPage} />
        ) : (
          <AdminDashboard onNavigate={setCurrentPage} />
        );
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onNavigateToAuth={handleNavigateToAuth} />;
  }

  if (viewMode === 'auth') {
    return (
      <AuthPage
        initialMode={authInitialMode}
        initialRole={authInitialRole}
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary, #F8FAFC)',
      }}
    >
      <Sidebar
        activePage={currentPage}
        currentRole={activeRole}
        onNavigate={(page) => {
          setCurrentPage(page);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentRole={activeRole}
          onSwitchRole={handleRoleSwitch}
          onLogout={handleLogout}
        />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.75rem',
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <ErrorBoundary onReset={() => setCurrentPage(getDefaultPageForRole(activeRole))}>
              {renderContent()}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;