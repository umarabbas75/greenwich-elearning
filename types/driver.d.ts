type DriverType = {
  name: string;
  customer: string;
  current_location: {
    lat: string;
    lng: string;
    location: {
      display_name: string;
    };
  };
  start_location?: {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lng: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    boundingbox: [string, string, string, string];
  };
  end_location?: {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lng: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype: string;
    name: string;
    display_name: string;
    boundingbox: [string, string, string, string];
  };
  logged_in: string;
  created_at: string;
  end_date: string;
  status: DriverStatus;
};
type DriverStatus = 'Working' | 'Inactive';
type DriverData = {
  count: number;
  next: null;
  previous: null;
  results: DriverType[];
};
