export type CourseType = {
  title: string;
  description: string;
  _id: string;
  status: 'active' | 'inActive';
};
export type CourseTypeStatus =
  | 'active'
  | 'inActive'
  | 'pendingApproval'
  | 'suspended';

export type CourseData = {
  count: number;
  next: null;
  previous: null;
  results: CourseType[];
};
