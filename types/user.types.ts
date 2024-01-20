export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  photo: string | null;
  status: 'active' | 'inActive' | 'pendingApproval' | 'suspended';
};
export type UserStatus =
  | 'active'
  | 'inActive'
  | 'pendingApproval'
  | 'suspended';

export type UserData = {
  count: number;
  next: null;
  previous: null;
  results: UserType[];
};
