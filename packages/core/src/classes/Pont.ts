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
  protected readonly stateManager: StateManager | undefined;
  protected readonly requestsManager: RequestsManager;

  protected readonly services!: {
    transporter: Transporter;
  };

  public constructor() {
    this.stateManager = new StateManager();
    this.requestsManager = new RequestsManager();

    this.services = {
      transporter: services.transporter ?? createDefaultTransporter(this),
    };
  }

  /**
   * Initialize the state manager with the initial state.
   * It must be called before using the app, usually withing the
   * `createPontApp` function of the adapter.
   */
  public init({ baseUrl, services = {} }: PontInit) {}

  public getBaseUrl() {
    return this.requestsManager.getBaseUrl();
  }

  /**
   * Get the requests manager.
   */
  public getRequestsManager() {
    return this.requestsManager;
  }

  /**
   * Get the state manager.
   */
  public getStateManager() {
    if (!this.stateManager) {
      throw new Error("Pont.init() must be called before using the app");
    }

    return this.stateManager;
  }

  public getTransporter() {
    return this.services.transporter;
  }
}

export type { Pont };
export const pont = new Pont();
