import { S } from "@auaust/primitive-kit";
import type { Effects } from "src/types/effects.js";
import type { ErrorBag } from "src/types/errors.js";
import type {
  AmbientResponse,
  AmbientResponseInit,
} from "./AmbientResponse.js";
import type { DataResponse, DataResponseInit } from "./DataResponse.js";
import type {
  FragmentResponse,
  FragmentResponseInit,
} from "./FragmentResponse.js";
import type { RawResponse } from "./RawResponse.js";
import { UnhandledResponse } from "./UnhandledResponse.js";
import type { VisitResponse, VisitResponseInit } from "./VisitResponse.js";

export type ResponseType = "visit" | "fragment" | "ambient" | "data";

export interface BaseResponseInit {
  type: ResponseType;
  title?: string | null;
  errors?: ErrorBag | null;
  effects?: Effects | null;
}

export type ResponsesMap = {
  visit: [typeof VisitResponse, VisitResponse, VisitResponseInit];
  fragment: [typeof FragmentResponse, FragmentResponse, FragmentResponseInit];
  ambient: [typeof AmbientResponse, AmbientResponse, AmbientResponseInit];
  data: [typeof DataResponse, DataResponse, DataResponseInit];
};

export type ResponseConstructor<T extends ResponseType = ResponseType> =
  ResponsesMap[T][0];

export type ResponseInstance<T extends ResponseType = ResponseType> =
  ResponsesMap[T][1];

export type ResponseInit<T extends ResponseType = ResponseType> =
  ResponsesMap[T][2];

export abstract class Response<T extends ResponseType = ResponseType> {
  public static isValidType(type: unknown): type is ResponseType {
    if (!S.is(type)) {
      return false;
    }

    switch (S.lower(type)) {
      case "visit":
      case "fragment":
      case "ambient":
      case "data":
        return true;
      default:
        return false;
    }
  }

  public static unhandled(raw: RawResponse): UnhandledResponse {
    return new UnhandledResponse(raw);
  }

  public readonly type: T;

  public constructor({ type }: BaseResponseInit) {
    this.type = <T>S.lower(type);
  }
}
