type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  photo: string | null;
  status: UserStatus;
};
type UserStatus = 'Active' | 'Inactive' | 'pendingApproval' | 'suspended';
type UserData = {
  count: number;
  next: null;
  previous: null;
  results: UserType[];
};
