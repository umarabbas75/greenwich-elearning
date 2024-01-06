type UserType = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer: string;
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
  password: string;
  role: string;
  photo: string | null;
  status: UserStatus;
};
type UserStatus = 'Active' | 'Inactive';
type UserData = {
  count: number;
  next: null;
  previous: null;
  results: UserType[];
};
