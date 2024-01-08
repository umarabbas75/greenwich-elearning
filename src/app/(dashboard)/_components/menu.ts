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
    id: 'user',
    title: 'User',
    icon: 'dashboard',
    link: '/user',
    role: ['Admin', 'Manager'],
    permissions: {
      Admin: ['read', 'update', 'delete', 'create'],
      Manager: ['read'],
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
