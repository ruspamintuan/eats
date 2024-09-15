export type Rows = {
  name: string;
  services: string;
  email: string;
  mobile: string;
  postcode: string;
};

export type ExpectedRows = {
  name: string;
  services: string[];
  email: string;
  mobile: string;
  postcode: string;
};

export type RowWithID = ExpectedRows & {
  id: number;
};
