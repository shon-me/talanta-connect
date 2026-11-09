// Where the admin area lives. Change it before going live: set VITE_ADMIN_PATH in .env to a long,
// random address (for example /ops-7f3k9q2xv8). Hiding the address is only a first layer. The real
// protection is the admin role check on the server, two-step login, and IP limits (see adminService.js).
export const ADMIN_BASE = import.meta.env.VITE_ADMIN_PATH || '/tc-admin-x7k2p9'

export const DASHBOARD_BASE = {
  creator: '/dashboard/creator',
  brand: '/dashboard/brand',
  admin: ADMIN_BASE,
}

export const DASHBOARD_LABEL = { creator: 'Creator', brand: 'Brand', admin: 'Admin' }

// path is relative to the dashboard's base address ('' is the first page)
export const dashboardNav = {
  creator: [
    { label: 'Overview', icon: 'mdi-view-dashboard-outline', path: '', exact: true },
    { label: 'Analytics', icon: 'mdi-chart-line', path: 'analytics' },
    { label: 'Brand collaborations', icon: 'mdi-handshake-outline', path: 'collaborations' },
    { label: 'Scope of work', icon: 'mdi-file-document-edit-outline', path: 'scopes' },
    { label: 'Payments', icon: 'mdi-wallet-outline', path: 'payments' },
    { label: 'Notifications', icon: 'mdi-bell-outline', path: 'notifications' },
    { label: 'Settings', icon: 'mdi-cog-outline', path: 'settings' },
  ],
  brand: [
    { label: 'Overview', icon: 'mdi-view-dashboard-outline', path: '', exact: true },
    { label: 'Analytics', icon: 'mdi-chart-line', path: 'analytics' },
    { label: 'Campaigns', icon: 'mdi-bullhorn-outline', path: 'campaigns' },
    { label: 'Creator collaborations', icon: 'mdi-account-group-outline', path: 'collaborations' },
    { label: 'Payments', icon: 'mdi-wallet-outline', path: 'payments' },
    { label: 'Notifications', icon: 'mdi-bell-outline', path: 'notifications' },
    { label: 'Settings', icon: 'mdi-cog-outline', path: 'settings' },
  ],
  admin: [
    { label: 'System analysis', icon: 'mdi-chart-box-outline', path: '', exact: true },
    { label: 'Verification', icon: 'mdi-shield-check-outline', path: 'verification' },
    { label: 'Landing page editor', icon: 'mdi-page-layout-header', path: 'landing' },
    { label: 'System logs', icon: 'mdi-text-box-search-outline', path: 'logs' },
    { label: 'Security reviews', icon: 'mdi-shield-alert-outline', path: 'security' },
    { label: 'Notifications', icon: 'mdi-bell-outline', path: 'notifications' },
  ],
}

// Icons for the kinds of activity and notification
export const TYPE_ICONS = {
  payment: 'mdi-cash-multiple',
  collaboration: 'mdi-handshake-outline',
  task: 'mdi-clipboard-text-outline',
  reminder: 'mdi-alarm',
  system: 'mdi-information-outline',
}
