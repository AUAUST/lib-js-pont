import { HeadersManager } from "src/managers/HeadersManager.js";
import { RequestsManager } from "src/managers/RequestsManager.js";
import { StateManager } from "src/managers/StateManager.js";
import {
  createDefaultTransporter,
  Transporter,
} from "src/services/TransporterService.js";

export type PontInit = {
  baseUrl?: string;
  services?: {
    transporter?: Transporter;
  };
};

class Pont {
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
      headers: new HeadersManager(),
      requests: new RequestsManager(),
      state: new StateManager(),
    };

    this.services = {};
  }

  public init({ baseUrl, services = {} }: PontInit) {
    this.managers.state.init();
    this.managers.requests.init();
    this.managers.headers.init();

    this.services.transporter =
      services.transporter ?? createDefaultTransporter(this);
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

export type { Pont };
export const pont = new Pont();
