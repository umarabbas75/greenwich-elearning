type CustomerType = {
  customer_id: string;
  custom_address: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  location: {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    boundingbox: [string, string, string, string];
  };
  status: CustomerStatus;
};

type CustomerStatus = 'Active';
type CustomerData = {
  count: number;
  next: null;
  previous: null;
  results: CustomerType[];
};
type TypesCustomerFormValues = {
  customer_id: any;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: object;
  custom_address: string;
  company: string;
};

type CheckCustomerIdPayload = {
  customer_id: number;
};
