import { SceneSearchResult } from "../types/scene";
import { SiteListResult } from "../types/sites";
import { Context } from "./../../types/plugin";

const BASE = "https://api.metadataapi.net/api";

export const ENDPOINTS = {
  SITES: `${BASE}/sites`,
  SCENES: `${BASE}/scenes`,
};

export class TPDBApi {
  axios: Context["$axios"];

  constructor(axios: Context["$axios"]) {
    this.axios = axios;
  }

  async getSites() {
    return this.axios.get<SiteListResult>(ENDPOINTS.SITES);
  }

  async parseScene(parse: string) {
    return this.axios.get<SceneSearchResult>(ENDPOINTS.SCENES, {
      params: {
        parse,
      },
    });
  }
}
