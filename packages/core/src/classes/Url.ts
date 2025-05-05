import { forwardCalls } from "src/utils/forwardsCalls.js";
import type { Pont } from "./Pont.js";
import { UrlParams, type UrlParamsInit } from "./UrlParams.js";

export interface Url extends Pick<UrlParams, "getParams" | "setParam"> {}

/**
 * A light wrapper around the URL class, which directly embeds URLSearchParams.
 * The most important part is that, by keeping reference to a Pont instance,
 * it correctly handles the base URL and the params serializer service.
 */
export class Url {
  protected readonly url: URL;
  protected readonly params: UrlParams;

  public constructor(
    public readonly pont: Pont,
    url: URL | string,
    params?: UrlParamsInit
  ) {
    this.url = new URL(url, this.getBaseUrl());
    this.params = new UrlParams(this, this.url.searchParams, params);

    forwardCalls(this.params, this, ["getParams", "setParam"]);
  }

  public getBaseUrl() {
    return this.pont.getBaseUrl();
  }

  public getUrl(): string {
    this.url.search = this.params.getParams();

    return this.url.toString();
  }
}
