type SidebarItem = {
  id: string;
  title: string;
  icon: string;
  link: string;
  role?: string[]; // Optional: role array for conditional rendering based on user role
  showInSidebar?: boolean; // Optional: to control visibility in the sidebar
};

type SidebarMenu = {
  admin: SidebarItem[];
  user: SidebarItem[];
};

export const sidebarMenu: SidebarMenu = {
  admin: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/',
    },
    {
      id: 'user',
      title: 'User',
      icon: 'user',
      link: '/user',
    },
    {
      id: 'course',
      title: 'Course',
      icon: 'book',
      link: '/course',
    },
    {
      id: 'quiz',
      title: 'Quiz',
      icon: 'bulb',
      link: '/quiz',
    },

    {
      id: 'forums',
      title: 'Forum',
      icon: 'forum',
      link: '/forum',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'setting',
      link: '/setting/account',
    },
  ],
  user: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/',
    },
    {
      id: 'studentCourses',
      title: 'Courses',
      icon: 'book',
      link: '/studentCourses',
    },
    {
      id: 'forums',
      title: 'Forum',
      icon: 'forum',
      link: '/forum',
    },
  ],
};
