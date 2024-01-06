type GensetsType = {
  type: number | null;
  genset_id: string;
  registration_number: string;
  serial_number: string;
  customer: string | null;
  subscription: string | null;
  date: string;
  qr_code: string;
  type_icon: string;
  iot_ready: boolean;
  status: GensetsStatus;
};
type GensetsStatus = 'Offline' | 'Running';

type GensetData = {
  count: number;
  next: null;
  previous: null;
  results: GensetsType[];
};

// type GensetFormValues = Omit<GensetsType, 'status' | 'date' | 'qr_code'>;
type GensetFormValues = {
  type: string | null | object;
  internal_number: string;
  registration_number: string;
  serial_number: string;
  customer: string | null | object;
  subscription: string | null | object;
};
