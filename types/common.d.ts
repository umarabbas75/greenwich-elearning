type Pagination = {
  pageIndex: number;
  pageSize: number;
};
type UserName = {
  firstName: string;
  lastName: string;
};
type PasswordChange = {
  new_password: string;
  old_password: string;
};

type Location = {
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
