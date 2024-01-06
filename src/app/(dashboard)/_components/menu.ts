type Role = 'Admin' | 'Manager';
type Permission = 'create' | 'read' | 'update' | 'delete';

type SidebarMenuItem = {
  id: string;
  title: string;
  icon: string;
  link: string;
  role: Role[];
  permissions: {
    Admin: Permission[];
    Manager: Permission[];
    //Staff?: Permission[];
  };
  showInSidebar?: boolean;
};

export const siderbarmenu: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },
  {
    id: 'gensetType',
    title: 'Genset Type',
    icon: 'types',
    link: '/gensetType',
    role: ['Admin'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },
  {
    id: 'genset',
    title: 'Genset',
    icon: 'genmark',
    link: '/genset',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },

  {
    id: 'customers',
    title: 'Customer',
    icon: 'customer',
    link: '/customer',
    role: ['Admin'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: [],
    },
  },
  {
    id: 'subscriptions',
    title: 'Subscription',
    icon: 'subscription',
    link: '/subscription',
    role: ['Admin'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: [],
    },
  },
  {
    id: 'drivers',
    title: 'Driver',
    icon: 'driver',
    link: '/driver',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },
  {
    id: 'gensetsonmap',
    title: 'Gensets on map',
    icon: 'map',
    link: '/gensetsonmap',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },
  {
    id: 'serviceDealer',
    title: 'Serive Dealer',
    icon: 'serviceDealer',
    link: '/serviceDealer',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
    },
  },
  {
    id: 'warnings',
    title: 'Alarms',
    icon: 'warning',
    link: '/warning',
    role: ['Admin'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: [],
    },
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'setting',
    link: '/setting/account',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read', 'update', 'delete', 'create'],
    },
  },
  {
    showInSidebar: false,
    id: 'settings',
    title: 'Settings',
    icon: 'setting',
    link: '/setting/users',
    role: ['Admin'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: [],
    },
  },
];
