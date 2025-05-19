import { S, type ObjectType } from "@auaust/primitive-kit";
import { Request, type RequestInit } from "@core/src/classes/Request.js";
import type { RequestDataInit } from "@core/src/classes/RequestData.js";
import { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import type {
  Response,
  ValidResponseInstance,
} from "@core/src/classes/Responses/Response.js";
import type { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import { ValidResponse } from "@core/src/classes/Responses/ValidResponse.js";
import { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import { ExecuteStatus } from "@core/src/enums/ExecuteStatus.js";
import { Method } from "@core/src/enums/Method.js";
import { Manager } from "@core/src/managers/Manager.js";
import type { ResponseParcel } from "@core/src/services/Transporter.js";
import { getBaseUrl } from "@core/src/utils/getBaseUrl.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: string;
};

export type VisitOptions = Omit<RequestInit, "url" | "mode">;

export type ExecuteResult<R extends Response = Response> =
  | {
      status: ExecuteStatus.CANCELED;
    }
  | {
      status: ExecuteStatus.FAILED;
      error?: Error;
    }
  | {
      status: ExecuteStatus.SUCCESS;
      response: R;
    };

export type MightFail<
  Success extends object,
  Failure extends object = { error: Error }
> = ({ success: true } & Success) | ({ success: false } & Failure);

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager extends Manager {
  protected baseUrl: string | undefined;

  public init({ baseUrl }: RequestManagerInit): this {
    this.baseUrl = getBaseUrl(baseUrl);

    if (!S.isStrict(this.baseUrl)) {
      throw new Error(
        `The base URL is not a valid URL and could not be determined automatically.`
      );
    }

    return this;
  }

  protected async transport(
    request: Request
  ): Promise<MightFail<{ parcel: ResponseParcel }>> {
    try {
      const options = request.getOptions();
      const parcel = await this.pont.use("transporter", options);

      return {
        success: true,
        parcel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  protected handleParcel(
    request: Request,
    parcel: ResponseParcel
  ): MightFail<
    { response: ValidResponseInstance },
    { error: Error; response: UnhandledResponse }
  > {
    const response = this.pont.use("responseHandler", request, parcel);

    if (response.isUnhandled()) {
      return {
        success: false,
        error: new Error(
          `The response was not handled. Reason: ${response.getReason()}`
        ),
        response,
      };
    }

    return { success: true, response };
  }

  protected async execute<R extends Response = Response>(
    request: Request
  ): Promise<ExecuteResult<R>>;
  protected async execute(request: Request): Promise<ExecuteResult> {
    const { canceled } = this.pont.emit("before", { request });

    if (canceled) {
      this.pont.emit("prevented", { request });

      return { status: ExecuteStatus.CANCELED };
    }

    let response: ValidResponseInstance | undefined;

    this.pont.emit("start", { request });

    try {
      const transport = await this.transport(request);

      if (!transport.success) {
        this.pont.emit("exception", { request, error: transport.error });

        return { status: ExecuteStatus.FAILED, error: transport.error };
      }

      const { parcel } = transport;

      this.pont.emit("received", { request, parcel });

      const handling = this.handleParcel(request, parcel);

      if (!handling.success) {
        const { canceled } = this.pont.emit("unhandled", {
          request,
          response: handling.response,
        });

        return { status: ExecuteStatus.FAILED, error: handling.error };
      }

      response = handling.response;

      if (
        !response.isOk() ||
        (response.isNavigation() && response.hasErrors())
      ) {
        this.pont.emit("error", {
          request,
          response,
          errors: response.isNavigation() ? response.getErrors() : undefined,
        });
      } else {
        this.pont.emit("success", { request, response });
      }

      return { status: ExecuteStatus.SUCCESS, response };
    } finally {
      this.pont.emit("finish", { request, response });
    }
  }

  public async data<T = ObjectType>(
    url: string,
    options: VisitOptions = {}
  ): Promise<T | undefined> {
    const request = this.createDataRequest(url, options);
    const result = await this.execute<DataResponse>(request);
    const { status } = result;

    if (status === ExecuteStatus.CANCELED) {
      throw new Error("The request was canceled.");
    }

    if (status === ExecuteStatus.FAILED) {
      throw result.error;
    }

    const { response } = result;

    this.pont.handleSideEffects(response);

    return <T>response.getData();
  }

  public async visit(url: string, options: VisitOptions = {}): Promise<void> {
    const request = this.createNavigationRequest(url, options);
    const result = await this.execute<ValidResponse>(request);
    const { status } = result;

    if (status === ExecuteStatus.CANCELED) {
      return;
    }

    if (status === ExecuteStatus.FAILED) {
      console.error("Request failed", result.error);

      return;
    }

    const { response } = result;

    this.pont.handleSideEffects(response);
    this.pont.updateState(response);
  }

  public async get(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, method: Method.GET });
  }

  public async post(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.POST });
  }

  public async put(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.PUT });
  }

  public async delete(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, method: Method.DELETE });
  }

  public async patch(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.PATCH });
  }

  public getBaseUrl(): string | undefined {
    return this.baseUrl;
  }

  public createRequest(
    mode: ExchangeMode,
    url: string,
    options: Omit<RequestInit, "url" | "mode">
  ): Request {
    return Request.create(this, { ...options, url, mode });
  }

  public createDataRequest(
    url: string,
    options: Omit<RequestInit, "url" | "mode">
  ): Request {
    return this.createRequest(ExchangeMode.DATA, url, options);
  }

  public createNavigationRequest(
    url: string,
    options: Omit<RequestInit, "url" | "mode">
  ): Request {
    return this.createRequest(ExchangeMode.NAVIGATION, url, options);
  }
}
