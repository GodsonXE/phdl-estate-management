import React, { useState, useEffect } from 'react';
import { usePhdlStore } from './data/storage';
import { Role } from './types';
import { Sidebar, ActivePage } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { PhdlAppLoader } from './components/common/PhdlAppLoader';
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';

// Core Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { SoldierDashboard } from './pages/dashboards/SoldierDashboard';
import { TenantDashboard } from './pages/dashboards/TenantDashboard';

// Admin Pages
import { SoldierOnboardingRegistryPage } from './pages/admin/SoldierOnboardingRegistryPage';
import { SoldierVerificationPage } from './pages/admin/SoldierVerificationPage';
import { TenantManagementPage } from './pages/admin/TenantManagementPage';
import { FlatManagementPage } from './pages/admin/FlatManagementPage';
import { EstateHierarchyPage } from './pages/admin/EstateHierarchyPage';
import { AdminTariffsManagementPage } from './pages/admin/AdminTariffsManagementPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { BillingManagementPage } from './pages/billing/BillingManagementPage';
import { IDCardManagementPage } from './pages/idcards/IDCardManagementPage';
import { NotificationCenterPage } from './pages/admin/NotificationCenterPage';
import { MaintenancePage } from './pages/maintenance/MaintenancePage';
import { SystemSettingsPage } from './pages/settings/SystemSettingsPage';

// Profile & User Settings
import { UserProfilePage } from './pages/profile/UserProfilePage';

// Soldier Pages
import { SoldierPropertiesPage } from './pages/soldier/SoldierPropertiesPage';
import { SoldierTenantsPage } from './pages/soldier/SoldierTenantsPage';
import { SoldierBillingPage } from './pages/soldier/SoldierBillingPage';
import { SoldierIDCardPage } from './pages/soldier/SoldierIDCardPage';

// Tenant Pages
import { TenantProfilePage } from './pages/tenant/TenantProfilePage';
import { TenantBillingPage } from './pages/tenant/TenantBillingPage';
import { TenantDependentsPage } from './pages/tenant/TenantDependentsPage';
import { TenantIDCardPage } from './pages/tenant/TenantIDCardPage';

type ViewMode = 'landing' | 'auth' | 'app';

export const App: React.FC = () => {
  const store = usePhdlStore();
  const [activeRole, setActiveRole] = useState<Role>(() => store.getActiveRole());
  const [isLoading, setIsLoading] = useState(true);
  
  // Default to Landing Page for all unauthenticated/new visitors
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<Role>('phdl_admin');

  const getDefaultPageForRole = (role: string): ActivePage => {
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

  // Sync active page if role changes
  useEffect(() => {
    if (activeRole === 'soldier' && !currentPage.startsWith('soldier_') && currentPage !== 'profile' && currentPage !== 'settings' && currentPage !== 'user_profile') {
      setCurrentPage('soldier_dashboard');
    } else if (activeRole === 'tenant' && !currentPage.startsWith('tenant_') && currentPage !== 'profile' && currentPage !== 'settings' && currentPage !== 'user_profile') {
      setCurrentPage('tenant_dashboard');
    } else if (
      activeRole === 'phdl_admin' &&
      !currentPage.startsWith('admin_') &&
      !['soldier_onboarding', 'billing_mgmt', 'gate_scanner', 'notifications_scheduler', 'maintenance', 'system_settings', 'settings', 'profile', 'user_profile'].includes(currentPage)
    ) {
      setCurrentPage('admin_dashboard');
    }
  }, [activeRole]);

  // Page View Switcher
  const renderContent = () => {
    switch (currentPage) {
      case 'admin_dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'soldier_onboarding':
      case 'admin_soldiers':
        return <SoldierOnboardingRegistryPage />;
      case 'admin_verification':
        return <SoldierVerificationPage />;
      case 'admin_tenants':
        return <TenantManagementPage />;
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
      case 'admin_admins':
        return <AdminUsersPage />;
      case 'admin_settings':
      case 'system_settings':
        return <SystemSettingsPage />;
      case 'notifications_scheduler':
        return <NotificationCenterPage />;
      case 'maintenance':
        return <MaintenancePage />;

      case 'soldier_dashboard':
        return <SoldierDashboard onNavigate={setCurrentPage} />;
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
        return <UserProfilePage />;

      case 'settings':
        return activeRole === 'phdl_admin' ? <SystemSettingsPage /> : <UserProfilePage />;
      case 'profile':
      case 'user_profile':
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

  // 1. PUBLIC LANDING PAGE (DEFAULT FOR FIRST-TIME VISITORS & LOGGED-OUT USERS)
  if (viewMode === 'landing') {
    return (
      <>
        {isLoading && <PhdlAppLoader onComplete={() => setIsLoading(false)} />}
        <LandingPage onNavigateToAuth={handleNavigateToAuth} />
      </>
    );
  }

  // 2. AUTHENTICATION (LOGIN / REGISTER) SCREEN
  if (viewMode === 'auth') {
    return (
      <>
        {isLoading && <PhdlAppLoader onComplete={() => setIsLoading(false)} />}
        <AuthPage
          initialMode={authInitialMode}
          initialRole={authInitialRole}
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setViewMode('landing')}
        />
      </>
    );
  }

  // 3. AUTHENTICATED APPLICATION DASHBOARD
  return (
    <>
      {isLoading && <PhdlAppLoader onComplete={() => setIsLoading(false)} />}

      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-primary, #F8FAFC)',
        }}
      >
        {/* Fixed Sidebar */}
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

        {/* Main Content Area */}
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
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
