import { A, O, S } from "@auaust/primitive-kit";
import { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import { EmptyResponse } from "@core/src/classes/Responses/EmptyResponse.js";
import { PartialResponse } from "@core/src/classes/Responses/PartialResponse.js";
import type { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import { Response } from "@core/src/classes/Responses/Response.js";
import { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import { VisitResponse } from "@core/src/classes/Responses/VisitResponse.js";
import { Service } from "@core/src/classes/Service.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { Effects } from "@core/src/types/effects.js";
import type { ErrorBag } from "@core/src/types/errors.js";

/**
 * Handles a raw response from the server and converts it into a usable format.
 * It is responsible for composing the partial responses, extracting the
 * various data parts, and returning a standardized response object.
 */
export type ResponseHandlerSignature = (
  response: RawResponse
) => Response | UnhandledResponse;

type ResponseContext = {
  payload: {
    type: ResponseType;
    [key: string]: unknown;
  };
  url: string;
  title?: string;
  errors?: ErrorBag;
  effects?: Effects;
  propsGroups: Partial<PropsGroups>;
};

export class ResponseHandlerService extends Service<"responseHandler"> {
  protected response!: RawResponse;
  protected data!: { type: ResponseType; [key: string]: unknown };

  public override handle(response: RawResponse) {
    this.response = response;

    if (!this.isPontResponse()) {
      return Response.unhandled(response, "Missing x-pont header");
    }

    const url = response.getUrl();
    const payload = this.payload();

    if (!payload) {
      // If there is no payload but the response is ok,
      // we return an EmptyResponse. It simply means the
      // request was successful, but there is nothing to do.
      if (response.isOk()) {
        return new EmptyResponse({ url });
      }

      return Response.unhandled(response, "Invalid payload");
    }

    this.data = payload;

    const type = payload.type;
    const title = this.title();
    const errors = this.errors();
    const effects = this.effects();
    const propsGroups = this.propsGroups();

    return this.createResponse(type, response, {
      payload,
      url,
      title,
      errors,
      effects,
      propsGroups,
    });
  }

  isPontResponse(): boolean {
    // If the header "x-pont" is not set, this means the response is not a Pont response.
    return this.response.hasHeader("x-pont");
  }

  createResponse(
    type: ResponseType,
    response: RawResponse,
    context: ResponseContext
  ) {
    switch (S.lower(type)) {
      case ResponseType.VISIT:
        return this.createVisitResponse(response, context);
      case ResponseType.PARTIAL:
        return this.createPartialResponse(response, context);
      case ResponseType.EMPTY:
        return this.createEmptyResponse(response, context);
      case ResponseType.DATA:
        return this.createDataResponse(response, context);
      // Should never happen, but just in case
      default:
        return Response.unhandled(response, "Invalid response type");
    }
  }

  createVisitResponse(
    response: RawResponse,
    context: ResponseContext
  ): VisitResponse | UnhandledResponse {
    const { payload, propsGroups } = context;

    const page = S.is(payload.page) ? payload.page : undefined;

    if (!page) {
      return Response.unhandled(response, "Missing page component");
    }

    const url = S.is(payload.url) ? payload.url : undefined;

    if (!url) {
      return Response.unhandled(response, "Missing URL");
    }

    if (!O.is(payload.props)) {
      return Response.unhandled(response, "Missing props");
    }

    const layout = S.is(payload.layout) ? payload.layout : undefined;

    propsGroups.page = O.is(payload.props.page) ? payload.props.page : {};

    return new VisitResponse({
      ...context,
      page,
      layout,
      url,
    });
  }

  createEmptyResponse(
    response: RawResponse,
    context: ResponseContext
  ): EmptyResponse {
    return new EmptyResponse(context);
  }

  createPartialResponse(
    response: RawResponse,
    context: ResponseContext
  ): PartialResponse | UnhandledResponse {
    const { payload } = context;

    const intendedPage = S.is(payload.page) ? payload.page : undefined;

    if (!intendedPage) {
      return Response.unhandled(response, "Missing intended page component");
    }

    return new PartialResponse({
      ...context,
      intendedPage,
    });
  }

  createDataResponse(
    response: RawResponse,
    context: ResponseContext
  ): DataResponse {
    return new DataResponse({
      ...context,
      data: context.payload.data,
    });
  }

  payload(): { type: ResponseType; [key: string]: unknown } | undefined {
    const json = this.response.getJson();

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
