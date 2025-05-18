import { A, B, N, O, S } from "@auaust/primitive-kit";
import type { Request } from "@core/src/classes/Request.js";
import { EmptyResponse } from "@core/src/classes/Responses/EmptyResponse.js";
import {
  Response,
  type ResponseInstance,
} from "@core/src/classes/Responses/Response.js";
import { Service } from "@core/src/classes/Service.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { ResponseParcel } from "@core/src/services/Transporter.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { Effects } from "@core/src/types/effects.js";
import type { ErrorBag } from "@core/src/types/errors.js";
import { RequestType } from "../enums/RequestType.js";

/**
 * Handles a raw response from the server and converts it into a usable format.
 * It is responsible for composing the partial responses, extracting the
 * various data parts, and returning a standardized response object.
 */
export type ResponseHandlerSignature = (
  request: Request,
  parcel: ResponseParcel
) => ResponseInstance;

type ResponseContext = {
  payload: {
    type: ResponseType;
    [key: string]: unknown;
  };
  status: number;
  url: string;
  title?: string;
  errors?: ErrorBag;
  effects?: Effects;
  propsGroups: Partial<PropsGroups>;
};

export class ResponseHandlerService extends Service<"responseHandler"> {
  protected request!: Request;
  protected parcel!: ResponseParcel;
  protected type!: ResponseType;
  protected status!: number;
  protected url!: URL;
  protected headers!: Headers;
  protected data!: unknown;

  public override handle(request: Request, parcel: ResponseParcel) {
    this.request = request;
    this.parcel = parcel;

    try {
      this.headers = this.parseHeaders();

      this.ensurePontResponse();

      this.type = this.parseResponseType();

      this.ensureResponseType();

      this.status = this.parseStatus();
      this.url = this.parseUrl();
    } catch (error) {
      return Response.unhandled(parcel, error.message);
    }

    const payload = this.payload();

    if (!payload) {
      // If there is no payload but the response is ok,
      // we return an EmptyResponse. It simply means the
      // request was successful, but there is nothing to do.
      if (parcel.isOk()) {
        return EmptyResponse.create({ url, status });
      }

      return Response.unhandled(parcel, "Invalid payload");
    }

    this.data = payload;

    const type = payload.type;

    if (
      (request.getType() === RequestType.DATA) !==
      (type === ResponseType.DATA)
    ) {
      return Response.unhandled(
        parcel,
        request.getType() === RequestType.DATA
          ? "Expected a data response"
          : "Expected a navigation response"
      );
    }

    const title = this.title();
    const errors = this.errors();
    const effects = this.effects();
    const propsGroups = this.propsGroups();

    return this.createResponse(type, parcel, {
      payload,
      url,
      status,
      title,
      errors,
      effects,
      propsGroups,
    });
  }

  protected prepare(): void {
    this.status = this.parseStatus();
    this.url = this.parseUrl();
    this.headers = this.parseHeaders();
  }

  protected parseStatus(): number {
    const status = this.parcel.status;

    if (
      !N.is(status) ||
      !N.isInteger(status) ||
      !N.isBetween(status, 200, 599)
    ) {
      throw new Error("A parcel with an invalid status was received");
    }

    return status;
  }

  protected parseUrl(): URL {
    const url = this.parcel.url;

    if (url instanceof URL) {
      return url;
    }

    const baseUrl = this.pont.getBaseUrl();

    if (URL.canParse(url, baseUrl)) {
      return new URL(url, baseUrl);
    }

    throw new Error("A parcel with an invalid URL was received");
  }

  protected parseHeaders(): Headers {
    const headers = this.parcel.headers;

    if (headers instanceof Headers) {
      return headers;
    }

    return new Headers(headers);
  }

  protected ensurePontResponse(): void {
    const pont = this.headers.get("x-pont");

    // If the header is not exactly set to `1` or `true`, it's not a valid Pont response.
    if (B.isLoose(pont) && !B.from(pont)) {
      throw new Error("The response does not contain the x-pont header");
    }
  }

  protected ensureResponseType(): void {
    const responseType = this.headers.get("x-pont-type");
    const requestType = this.request.getType();

    if (responseType === ResponseType.DATA) {
      if (requestType !== RequestType.DATA) {
        throw new Error(
          "A data response was received from a navigation request"
        );
      }

      return;
    }

    if (requestType === RequestType.DATA) {
      if (responseType !== ResponseType.DATA) {
        throw new Error(
          "A navigation response was received from a data request"
        );
      }

      return;
    }

    if (this.headers.get("content-type") !== "application/json") {
      throw new Error(
        "A navigation response was received without JSON content"
      );
    }
  }

  // createResponse(
  //   type: ResponseType,
  //   response: RawResponse,
  //   context: ResponseContext
  // ) {
  //   switch (S.lower(type)) {
  //     case ResponseType.VISIT:
  //       return this.createVisitResponse(response, context);
  //     case ResponseType.PARTIAL:
  //       return this.createPartialResponse(response, context);
  //     case ResponseType.EMPTY:
  //       return this.createEmptyResponse(response, context);
  //     case ResponseType.DATA:
  //       return this.createDataResponse(response, context);
  //     // Should never happen, but just in case
  //     default:
  //       return Response.unhandled(response, "Invalid response type");
  //   }
  // }

  // createVisitResponse(
  //   response: RawResponse,
  //   context: ResponseContext
  // ): VisitResponse | UnhandledResponse {
  //   const { payload, propsGroups } = context;

  //   const page = S.is(payload.page) ? payload.page : undefined;

  //   if (!page) {
  //     return Response.unhandled(response, "Missing page component");
  //   }

  //   const url = S.is(payload.url) ? payload.url : undefined;

  //   if (!url) {
  //     return Response.unhandled(response, "Missing URL");
  //   }

  //   const layout = S.is(payload.layout) ? payload.layout : undefined;

  //   propsGroups.page = O(O.deepGet(payload, "propsGroups.page"));
  //   propsGroups.layout = O(O.deepGet(payload, "propsGroups.layout"));

  //   return VisitResponse.create({
  //     ...context,
  //     url,
  //     page,
  //     layout,
  //     propsGroups,
  //   });
  // }

  // createEmptyResponse(
  //   response: RawResponse,
  //   context: ResponseContext
  // ): EmptyResponse {
  //   return EmptyResponse.create(context);
  // }

  // createPartialResponse(
  //   response: RawResponse,
  //   context: ResponseContext
  // ): PartialResponse | UnhandledResponse {
  //   const { payload } = context;

  //   const intendedPage = S.is(payload.page) ? payload.page : undefined;

  //   if (!intendedPage) {
  //     return Response.unhandled(response, "Missing intended page component");
  //   }

  //   return PartialResponse.create({
  //     ...context,
  //     intendedPage,
  //   });
  // }

  // createDataResponse(
  //   response: RawResponse,
  //   context: ResponseContext
  // ): DataResponse {
  //   return DataResponse.create({
  //     ...context,
  //     data: context.payload.data,
  //   });
  // }

  payload(): { type: ResponseType; [key: string]: unknown } | undefined {
    const json = this.parcel.getJson();

    // If the response has no JSON data, it is not valid.
    // The JSON data is required to include the response type, props and such.
    if (!O.is(json)) {
      return;
    }

    // If the response type is not set, it is not valid.
    // It is required for the server to specify the response type
    // otherwise the client cannot know how to handle it.
    if (!Response.isValidType(json.type)) {
      return;
    }

    // @ts-expect-error - The type is not inferred correctly
    return json;
  }

  title(): string | undefined {
    return S.is(this.data.title) ? this.data.title : undefined;
  }

  errors(): ErrorBag | undefined {
    if (!O.is(this.data.errors)) {
      return;
    }

    const errorBag: ErrorBag = {};

    for (const [field, errors] of O.entries(this.data.errors)) {
      if (S.is(field)) {
        errorBag[field] = A.wrap(errors).map(S).filter(Boolean);
      }
    }

    return errorBag;
  }

  effects(): Effects | undefined {
    if (!A.is(this.data.effects)) {
      return;
    }

    const effects: Effects = [];

    for (const effect of this.data.effects) {
      if (O.is(effect)) {
        if (S.is(effect.type)) {
          // @ts-expect-error - The type is not inferred correctly
          effects.push(effect);
        }
      } else if (S.is(effect)) {
        effects.push({ type: effect });
      }
    }

    return effects;
  }

  /**
   * Tries extracting the global props groups from the response data.
   */
  propsGroups(): Partial<PropsGroups> {
    const propsGroups: Partial<PropsGroups> = {};

    if (!O.is(this.data.propsGroups)) {
      return propsGroups;
    }

    if (O.is(this.data.propsGroups.global)) {
      propsGroups.global = this.data.propsGroups.global;
    }

    return propsGroups;
  }
}
