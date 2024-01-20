type Role = 'admin' | 'student';
type Permission = 'create' | 'read' | 'update' | 'delete';

type SidebarMenuItem = {
  id: string;
  title: string;
  icon: string;
  link: string;
  role: Role[];
  permissions: {
    admin: Permission[];
    student: Permission[];
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
    role: ['admin', 'student'],
    permissions: {
      admin: ['read', 'update', 'delete', 'create'],
      student: ['read'],
    },
  },
  {
    id: 'user',
    title: 'User',
    icon: 'dashboard',
    link: '/user',
    role: ['admin', 'student'],
    permissions: {
      admin: ['read', 'update', 'delete', 'create'],
      student: ['read'],
    },
  },
  {
    id: 'course',
    title: 'Course',
    icon: 'dashboard',
    link: '/course',
    role: ['admin', 'student'],
    permissions: {
      admin: ['read', 'update', 'delete', 'create'],
      student: ['read'],
    },
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'setting',
    link: '/setting/account',
    role: ['admin', 'student'],
    permissions: {
      admin: ['read', 'update', 'delete', 'create'],
      student: ['read', 'update', 'delete', 'create'],
    },
  },
  {
    showInSidebar: false,
    id: 'settings',
    title: 'Settings',
    icon: 'setting',
    link: '/setting/users',
    role: ['admin'],
    permissions: {
      admin: ['read', 'update', 'delete', 'create'],
      student: [],
    },
  },
];
