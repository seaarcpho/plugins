import { AxiosInstance, AxiosResponse } from "axios";

import { SceneResult, SiteResult } from "../types";
import { Context } from "./../../../types/plugin";

export class Api {
  ctx: Context;
  axios: AxiosInstance;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.axios = ctx.$axios.create({
      baseURL: "https://api.metadataapi.net/api",
    });
  }

  async parseScene(parse: string): Promise<AxiosResponse<SceneResult.SceneListResult>> {
    return this.axios.get<SceneResult.SceneListResult>("/scenes", {
      params: {
        parse,
      },
    });
  }

  async getSites(): Promise<AxiosResponse<SiteResult.SiteListResult>> {
    return this.axios.get<SiteResult.SiteListResult>("/sites");
  }
}
