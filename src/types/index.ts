export interface Role {
  role_id: number;
  role_name: string;
}

export interface Account {
  account_id: number;
  account_name: string;
}

export interface Facility {
  facility_id: number;
  facility_name: string;
  account_id: number;
}
