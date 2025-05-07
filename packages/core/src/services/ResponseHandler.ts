import { A, O, S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { AmbientResponse } from "src/classes/Responses/AmbientResponse.js";
import { DataResponse } from "src/classes/Responses/DataResponse.js";
import { FragmentResponse } from "src/classes/Responses/FragmentResponse.js";
import type { RawResponse } from "src/classes/Responses/RawResponse.js";
import { Response } from "src/classes/Responses/Response.js";
import { UnhandledResponse } from "src/classes/Responses/UnhandledResponse.js";
import { VisitResponse } from "src/classes/Responses/VisitResponse.js";
import { ResponseType } from "src/enums/ResponseType.js";
import type { PropsGroups } from "src/types/app.js";
import type { Effects } from "src/types/effects.js";
import type { ErrorBag } from "src/types/errors.js";
import type { Service } from "./index.js";

export interface ResponseHandler extends Service {
  /**
   * Handles a raw response from the server and converts it into a usable format.
   * It is responsible for composing the fragment responses, extracting the
   * various data parts, and returning a standardized response object.
   */
  handle(pont: Pont, response: RawResponse): Response | UnhandledResponse;
}

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

export function createDefaultResponseHandler() {
  return {
    handle(pont: Pont, response: RawResponse) {
      const payload = this.payload(response);

      if (!payload) {
        return Response.unhandled(response);
      }

      const type = payload.type;
      const url = response.getUrl();
      const title = this.title(payload);
      const errors = this.errors(payload);
      const effects = this.effects(payload);
      const propsGroups = this.propsGroups(payload);

      return this.createResponse(type, response, {
        payload,
        url,
        title,
        errors,
        effects,
        propsGroups,
      });
    },

    createResponse(
      type: ResponseType,
      response: RawResponse,
      context: ResponseContext
    ) {
      switch (S.lower(type)) {
        case ResponseType.VISIT:
          return this.createVisitResponse(response, context);
        case ResponseType.FRAGMENT:
          return this.createFragmentResponse(response, context);
        case ResponseType.AMBIENT:
          return this.createAmbientResponse(response, context);
        case ResponseType.DATA:
          return this.createDataResponse(response, context);
        // Should never happen, but just in case
        default:
          return Response.unhandled(response);
      }
    },

    createVisitResponse(
      response: RawResponse,
      context: ResponseContext
    ): VisitResponse | UnhandledResponse {
      const { payload, propsGroups } = context;

      const component = S.is(payload.component) ? payload.component : undefined;

      if (!component) {
        return Response.unhandled(response);
      }

      const url = S.is(payload.url) ? payload.url : undefined;

      if (!url) {
        return Response.unhandled(response);
      }

      if (!O.is(payload.props)) {
        return Response.unhandled(response);
      }

      propsGroups.page = O.is(payload.props.page) ? payload.props.page : {};

      return new VisitResponse({
        ...context,
        component,
        url,
      });
    },

    createAmbientResponse(
      response: RawResponse,
      context: ResponseContext
    ): AmbientResponse {
      return new AmbientResponse({
        ...context,
      });
    },

    createFragmentResponse(
      response: RawResponse,
      context: ResponseContext
    ): FragmentResponse | UnhandledResponse {
      const { payload } = context;

      const intendedComponent = S.is(payload.component)
        ? payload.component
        : undefined;

      if (!intendedComponent) {
        return Response.unhandled(response);
      }

      return new FragmentResponse({
        ...context,
        intendedComponent,
      });
    },

    createDataResponse(
      response: RawResponse,
      context: ResponseContext
    ): DataResponse {
      return new DataResponse({
        ...context,
        data: context.payload.data,
      });
    },

    /**
     * Validates the raw response from the server,
     * ensuring it has the correct headers and a body.
     * It either returns the raw parsed JSON payload,
     * or undefined if the response is not valid.
     */
    payload(response: RawResponse):
      | {
          type: ResponseType;
          [key: string]: unknown;
        }
      | undefined {
      // If the header "x-pont" is not set, this means the response
      // is not a Pont response. Returning an UnhandledResponse
      // ensures the response is forwarded to the unhandled response service.
      if (!response.hasHeader("x-pont")) {
        return;
      }

      const json = response.getJson();

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
    },

    /**
     * Tries extracting the title from the response data.
     */
    title(data: Record<string, unknown>): string | undefined {
      return S.is(data.title) ? data.title : undefined;
    },

    /**
     * Tries extracting the errors from the response data.
     */
    errors(data: Record<string, unknown>): ErrorBag | undefined {
      if (!O.is(data.errors)) {
        return;
      }

      const errorBag: ErrorBag = {};

      for (const [field, errors] of O.entries(data.errors)) {
        if (S.is(field)) {
          errorBag[field] = A.wrap(errors).map(S).filter(Boolean);
        }
      }

      return errorBag;
    },

    /**
     * Tries extracting the effects from the response data.
     */
    effects(data: Record<string, unknown>): Effects | undefined {
      if (!A.is(data.effects)) {
        return;
      }

      const effects: Effects = [];

      for (const effect of data.effects) {
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
    },

    /**
     * Tries extracting the global props groups from the response data.
     */
    propsGroups(data: Record<string, unknown>): Partial<PropsGroups> {
      const propsGroups: Partial<PropsGroups> = {};

      if (!O.is(data.propsGroups)) {
        return propsGroups;
      }

      if (O.is(data.propsGroups.global)) {
        propsGroups.global = data.propsGroups.global;
      }

      return propsGroups;
    },
  };
}
