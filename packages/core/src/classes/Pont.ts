import {
  HeadersManager,
  RequestsManager,
  ServicesManager,
  StateManager,
  type HeadersManagerInit,
  type ServicesManagerInit,
  type StateManagerInit,
} from "src/managers/index.js";
import { forwardCalls } from "src/utils/forwardCalls.js";
import { Url } from "./Url.js";
import type { UrlParamsInit } from "./UrlParams.js";

export interface WithPont {
  readonly pont: Pont;
}

export type PontInit = {
  baseUrl?: string;
} & HeadersManagerInit &
  StateManagerInit &
  ServicesManagerInit;

interface Pont
  extends Pick<
    RequestsManager,
    | "getBaseUrl"
    | "data"
    | "visit"
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
  > {}

interface Pont
  extends Pick<
    StateManager,
    "getComponent" | "getUrl" | "getPageProps" | "getGlobalProps"
  > {}

interface Pont extends Pick<ServicesManager, "use"> {}

class Pont implements WithPont {
  protected static instance: Pont;

  public static getInstance(): Pont {
    return (this.instance ??= new this());
  }

  public readonly pont: Pont;
  protected initialized: boolean = false;

  protected readonly managers: {
    headers: HeadersManager;
    requests: RequestsManager;
    services: ServicesManager;
    state: StateManager;
  };

  public constructor() {
    this.pont = this;

    this.managers = {
      headers: new HeadersManager(this),
      requests: new RequestsManager(this),
      services: new ServicesManager(this),
      state: new StateManager(this),
    };

    forwardCalls(this.managers.requests, this, [
      "getBaseUrl",
      "data",
      "visit",
      "get",
      "post",
      "put",
      "delete",
      "patch",
    ]);

    forwardCalls(this.managers.state, this, [
      "getComponent",
      "getGlobalProps",
      "getPageProps",
      "getUrl",
    ]);

    forwardCalls(this.managers.services, this, ["use"]);
  }

  public init({
    baseUrl,
    defaultHeaders,
    initialState,
    services,
  }: PontInit = {}): this {
    if (this.initialized) {
      throw new Error("Pont is already initialized");
    }

    this.managers.state.init({ initialState });
    this.managers.requests.init({ baseUrl });
    this.managers.headers.init({ defaultHeaders });
    this.managers.services.init({ services });

    this.initialized = true;

    return this;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getStateManager() {
    return this.managers.state;
  }

  public getRequestsManager() {
    return this.managers.requests;
  }

  public getHeadersManager() {
    return this.managers.headers;
  }

  public getServicesManager() {
    return this.managers.services;
  }

  public createUrl(url: string, params?: UrlParamsInit) {
    return new Url(this, url, params);
  }
}

export { Pont };
