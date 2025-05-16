import { Url } from "@core/src/classes/Url.js";
import type { UrlParamsInit } from "@core/src/classes/UrlParams.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { HasSingleton } from "@core/src/concerns/HasSingleton.js";
import {
  HeadersManager,
  RequestsManager,
  ServicesManager,
  StateManager,
  type HeadersManagerInit,
  type ServicesManagerInit,
  type StateManagerInit,
} from "@core/src/managers/index.js";
import { forwardCalls } from "@core/src/utils/forwardCalls.js";

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
    | "getGlobalProps"
    | "getLayout"
    | "getLayoutProps"
    | "getPage"
    | "getPageProps"
    | "getTitle"
    | "getUrl"
  > {}

interface Pont extends Pick<ServicesManager, "use"> {}

class Pont extends Creatable(HasSingleton()) implements WithPont {
  public readonly pont: Pont;
  protected initialized: boolean = false;

  protected readonly managers: {
    headers: HeadersManager;
    requests: RequestsManager;
    services: ServicesManager;
    state: StateManager;
  };

  public constructor() {
    super();

    this.pont = this;

    this.managers = {
      headers: HeadersManager.create(this),
      requests: RequestsManager.create(this),
      services: ServicesManager.create(this),
      state: StateManager.create(this),
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
      "getGlobalProps",
      "getLayout",
      "getLayoutProps",
      "getPage",
      "getPageProps",
      "getTitle",
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
    return Url.create(this, url, params);
  }
}

export { Pont };
