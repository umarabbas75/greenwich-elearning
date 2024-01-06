type ServiceDealerType = {
  station_name: string;
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
  status: ServiceDealerStatus;
};
type ServiceDealerStatus = 'Offline' | 'Running';
type ServiceDealerData = {
  count: number;
  next: null;
  previous: null;
  results: ServiceDealerType[];
};

// type ServiceDealerFormValues = Omit<GensetsType, 'status' | 'date' | 'qr_code'>;
type OpeningHours = {
  label: string;
  available: boolean;
  start_time: string | null;
  end_time: string | null;
};
type ServiceDealerFormValues = {
  station_name: string;
  phone: string;
  location: object;
  opening_hours: OpeningHours[];
};
