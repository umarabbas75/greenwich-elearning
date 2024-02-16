import { useSession } from 'next-auth/react';

import { siderbarmenu } from '@/app/(dashboard)/_components/menu';

type Props = {
  module:
    | 'dashboard'
    | 'gensetType'
    | 'genset'
    | 'customers'
    | 'subscriptions'
    | 'drivers'
    | 'gensetsonmap'
    | 'serviceDealer'
    | 'warnings'
    | 'settings';
  access: Permission[];
};
type Role = 'admin' | 'student';
type Permission = 'create' | 'read' | 'update' | 'delete';

type MenuItem = {
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
};
const useCanUserAccess = ({ module, access }: Props) => {
  const { data: session } = useSession();
  const menu = siderbarmenu;
  const currentModule: MenuItem = menu.find((item: any) => item.id === module)!;

  const role: Role = session?.user?.role || 'admin';

  const checkPermissions = (currentPermission: Permission[], access: Permission[]) => {
    return access.map((permission) => currentPermission?.includes(permission));
  };

  const currentPermissions = currentModule?.permissions[role];
  return checkPermissions(currentPermissions, access);
};

export default useCanUserAccess;
