import { O } from "@auaust/primitive-kit";
import {
  HeadersManager,
  RequestsManager,
  StateManager,
} from "src/managers/index.js";
import {
  createDefaultParamsSerializer,
  createDefaultResponseHandler,
  createDefaultTransporter,
  type ParamsSerializer,
  type PartialServicesMap,
  type ResponseHandler,
  type ServiceName,
  type ServiceParameters,
  type ServiceReturnType,
  type Transporter,
} from "src/services/index.js";
import type { PontAppStateInit } from "src/types/index.js";
import { forwardCalls } from "src/utils/index.js";
import { Url } from "./Url.js";
import type { UrlParamsInit } from "./UrlParams.js";

export interface WithPont {
  readonly pont: Pont;
}

export type PontInit = {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  initialState?: PontAppStateInit;
  services?: PartialServicesMap;
};

interface Pont
  extends Pick<
    RequestsManager,
    "getBaseUrl" | "visit" | "get" | "post" | "put" | "delete" | "patch"
  > {}

interface Pont
  extends Pick<
    StateManager,
    "getComponent" | "getUrl" | "getPageProps" | "getGlobalProps"
  > {}

class Pont implements WithPont {
  protected static instance: Pont;

  public static getInstance(): Pont {
    return (this.instance ??= new this());
  }

  protected initialized: boolean = false;

  protected readonly managers: {
    headers: HeadersManager;
    requests: RequestsManager;
    state: StateManager;
  };

  protected readonly services: {
    transporter?: Transporter;
    paramsSerializer?: ParamsSerializer;
    responseHandler?: ResponseHandler;
  } = {};

  public constructor() {
    this.managers = {
      headers: new HeadersManager(this),
      requests: new RequestsManager(this),
      state: new StateManager(this),
    };

    forwardCalls(this.managers.requests, this, [
      "getBaseUrl",
      "visit",
      "get",
      "post",
      "put",
      "delete",
      "patch",
    ]);

    forwardCalls(this.managers.state, this, [
      "getComponent",
      "getUrl",
      "getPageProps",
      "getGlobalProps",
    ]);
  }

  public init({
    baseUrl,
    defaultHeaders,
    initialState,
    services,
  }: PontInit): this {
    if (this.initialized) {
      throw new Error("Pont is already initialized");
    }

    this.managers.state.init({ initialState });
    this.managers.requests.init({ baseUrl });
    this.managers.headers.init({ defaultHeaders });

    this.registerServices(services, [
      ["transporter", createDefaultTransporter],
      ["paramsSerializer", createDefaultParamsSerializer],
      ["responseHandler", createDefaultResponseHandler],
    ]);

    this.initialized = true;

    return this;
  }

  public get pont(): Pont {
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

  protected registerServices(
    services: PontInit["services"],
    config: NonNullable<
      {
        [K in keyof Pont["services"]]: [
          name: K,
          factory: (pont: Pont) => NonNullable<Pont["services"][K]>
        ];
      }[keyof Pont["services"]]
    >[]
  ): this {
    if (this.initialized) {
      throw new Error("Pont is already initialized");
    }

    for (const [name, factory] of config) {
      if (services && O.is(services[name])) {
        // @ts-expect-error - TS is not able to infer that the pairs are always of the same type
        this.services[name] = services[name];
      } else {
        // @ts-expect-error
        this.services[name] = factory(this);
      }
    }

    return this;
  }

  public createUrl(url: string, params?: UrlParamsInit) {
    return new Url(this, url, params);
  }

  public getService<T extends keyof Pont["services"]>(name: T) {
    const service = this.services[name];

    if (!service) {
      throw new Error(`Service ${name} does not exist`);
    }

    return service;
  }

  /**
   * Calls the specified service with the given arguments.
   */
  public use<T extends ServiceName>(
    serviceName: T,
    ...args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService(serviceName);

    // @ts-expect-error - The unions are converted to intersections by `ReturnType` and `Parameters` thus the types can no longer be satisfied
    return service.handle.call(service, this, ...args);
  }
}

export { Pont };
