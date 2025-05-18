import { Url } from "@core/src/classes/Url.js";
import type { UrlParamsInit } from "@core/src/classes/UrlParams.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { HasSingleton } from "@core/src/concerns/HasSingleton.js";
import type { WithPont } from "@core/src/contracts/WithPont.js";
import type { EventRegistrars } from "@core/src/managers/EventsManager.js";
import {
  EventsManager,
  HeadersManager,
  RequestsManager,
  ServicesManager,
  StateManager,
  type EventsManagerInit,
  type HeadersManagerInit,
  type ServicesManagerInit,
  type StateManagerInit,
} from "@core/src/managers/index.js";
import { forwardCalls } from "@core/src/utils/forwardCalls.js";

export type PontInit = {
  baseUrl?: string;
} & EventsManagerInit &
  HeadersManagerInit &
  ServicesManagerInit &
  StateManagerInit;

interface Pont
  extends Pick<EventsManager, "emit" | "on" | "once" | keyof EventRegistrars> {}

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
    events: EventsManager;
    headers: HeadersManager;
    requests: RequestsManager;
    services: ServicesManager;
    state: StateManager;
  };

  public static from(init: PontInit): Pont {
    return Pont.create().init(init);
  }

  public constructor() {
    super();

    this.pont = this;

    this.managers = {
      events: EventsManager.create(this),
      headers: HeadersManager.create(this),
      requests: RequestsManager.create(this),
      services: ServicesManager.create(this),
      state: StateManager.create(this),
    };

    forwardCalls(this.managers.events, this.pont, [
      "emit",
      "on",
      "once",
      "onBefore",
      "onError",
      "onException",
      "onFinish",
      "onPrevented",
      "onReceived",
      "onStart",
      "onSuccess",
      "onUnhandled",
    ]);

    forwardCalls(this.managers.requests, this.pont, [
      "getBaseUrl",
      "data",
      "visit",
      "get",
      "post",
      "put",
      "delete",
      "patch",
    ]);

    forwardCalls(this.managers.services, this.pont, ["use"]);

    forwardCalls(this.managers.state, this.pont, [
      "getGlobalProps",
      "getLayout",
      "getLayoutProps",
      "getPage",
      "getPageProps",
      "getTitle",
      "getUrl",
    ]);
  }

  public init({
    baseUrl,
    defaultHeaders,
    initialState,
    services,
    listeners,
  }: PontInit = {}): this {
    if (this.initialized) {
      throw new Error("Pont is already initialized");
    }

    this.managers.events.init({ listeners });
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

  public getEventsManager() {
    return this.managers.events;
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
