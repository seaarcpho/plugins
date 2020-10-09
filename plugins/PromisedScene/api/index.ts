import Axios from "axios";

import { SceneSearchResult } from "../types/scene";
import { SiteListResult } from "../types/sites";

const BASE = "https://api.metadataapi.net/api";

export const ENDPOINTS = {
  SITES: `${BASE}/sites`,
  SCENES: `${BASE}/scenes`,
};

export class TPDBApi {
  axios: typeof Axios;

  constructor(axios: typeof Axios) {
    this.axios = axios;
  }

  async getSites() {
    return this.axios.get<SiteListResult>(ENDPOINTS.SCENES);
  }

  async parseScene(parse: string) {
    return this.axios.get<SceneSearchResult>(ENDPOINTS.SCENES, {
      params: {
        parse,
      },
    });
  }
}
