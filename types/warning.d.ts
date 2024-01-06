type WarningType = {
  created_at: string;
  genset: genset | string;
  type: string;
  warning: string;
  first_warning: string;
  lat_lng: string;
  end_warning_datetime: string;
  description: string;
  customer: string;
  status: WarningStatus;
  data: any;
};
type WarningStatus = 'Active' | 'Inactive';
type WarningData = {
  count: number;
  next: null;
  previous: null;
  results: WarningType[];
};
