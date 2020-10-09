export interface Data {
  id: number;
  name: string;
  short_name: string;
  url: string;
  logo: string;
  favicon: string;
}

export interface SiteListResult {
  data: Data[];
}
