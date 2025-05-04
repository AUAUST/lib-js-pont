import axios from "axios";
import type { Transporter } from "src/types/transporter.js";

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager {
  /**
   * The axios instance used to make requests.
   */
  protected readonly transporter: Transporter;

  public constructor(transporter?: Transporter) {
    this.transporter =
      transporter ??
      axios.create({
        baseURL: "",
      });
  }

  public getTransporter(): Transporter {
    return this.transporter;
  }
}
