export type CourseType = {
  title: string;
  description: string;
  _id: string;
  status: 'active' | 'inActive';
};
export type CourseTypeStatus = 'active' | 'inActive' | 'pendingApproval' | 'suspended';

export type CourseData = {
  count: number;
  next: null;
  previous: null;
  results: CourseType[];
};

export type ModuleType = {
  title: string;
  description: string;
  _id: string;
  status: 'active' | 'inActive';
};
export type ModuleTypeStatus = 'active' | 'inActive' | 'pendingApproval' | 'suspended';

export type ModuleData = {
  count: number;
  next: null;
  previous: null;
  results: ModuleType[];
};

export type ChapterType = {
  title: string;
  description: string;
  _id: string;
  status: 'active' | 'inActive';
};
export type ChapterTypeStatus = 'active' | 'inActive' | 'pendingApproval' | 'suspended';

export type ChapterData = {
  count: number;
  next: null;
  previous: null;
  results: ChapterType[];
};
export type SectionType = {
  title: string;
  description: string;
  _id: string;
  status: 'active' | 'inActive';
};
export type SectionTypeStatus = 'active' | 'inActive' | 'pendingApproval' | 'suspended';

export type SectionTypeData = {
  count: number;
  next: null;
  previous: null;
  results: SectionType[];
};
