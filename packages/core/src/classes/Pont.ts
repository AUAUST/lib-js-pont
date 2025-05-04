import { HeadersManager } from "src/managers/HeadersManager.js";
import { RequestsManager } from "src/managers/RequestsManager.js";
import { StateManager } from "src/managers/StateManager.js";
import {
  createDefaultTransporter,
  type Transporter,
} from "src/services/Transporter.js";
import type { PontAppStateInit } from "src/types/app.js";
import { forwardCalls } from "src/utils/forwardsCalls.js";

export type PontInit = {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  initialState?: PontAppStateInit;
  services?: { transporter?: Transporter };
};

interface Pont
  extends Pick<
    RequestsManager,
    "getBaseUrl" | "visit" | "get" | "post" | "put" | "delete" | "patch"
  > {}

class Pont {
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

    this.services.transporter =
      services?.transporter ?? createDefaultTransporter(this);

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

  public getService<T extends keyof Pont["services"]>(
    name: T
  ): NonNullable<Pont["services"][T]> {
    const service = this.services[name];

    if (!service) {
      throw new Error(`Pont ${name} is not initialized`);
    }

    return service;
  }

  public getTransporter(): Transporter {
    return this.getService("transporter");
  }
}

const pont = Pont.getInstance();

export { pont, Pont };
