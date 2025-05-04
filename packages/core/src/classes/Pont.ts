import { HeadersManager } from "src/managers/HeadersManager.js";
import {
  RequestsManager,
  type VisitOptions,
} from "src/managers/RequestsManager.js";
import { StateManager } from "src/managers/StateManager.js";
import {
  createDefaultTransporter,
  type Transporter,
} from "src/services/TransporterService.js";

export type PontInit = {
  baseUrl?: string;
  services?: {
    transporter?: Transporter;
  };
};

class Pont {
  protected static instance: Pont;

  public static getInstance(): Pont {
    return (this.instance ??= new this());
  }

  protected readonly managers: {
    headers: HeadersManager;
    requests: RequestsManager;
    state: StateManager;
  };

  protected readonly services: {
    transporter?: Transporter;
  };

  public constructor() {
    this.managers = {
      headers: new HeadersManager(this),
      requests: new RequestsManager(this),
      state: new StateManager(this),
    };

    this.services = {};
  }

  public init({ services }: PontInit): this {
    this.managers.state.init({});
    this.managers.requests.init({});
    this.managers.headers.init();

    this.services.transporter =
      services?.transporter ?? createDefaultTransporter(this);

    return this;
  }

  public async visit(url: string, options: VisitOptions): Promise<Response> {
    return this.getRequestsManager().visit(url, options);
  }

  public getBaseUrl() {
    return this.getRequestsManager().getBaseUrl();
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

  public getTransporter(): Transporter {
    if (!this.services.transporter) {
      throw new Error("Pont is not initialized");
    }

    return this.services.transporter;
  }
}

const pont = Pont.getInstance();

export { pont, Pont };
