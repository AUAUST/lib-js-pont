import { A, O, S } from "@auaust/primitive-kit";
import { ResponseType } from "src/enums/ResponseType.js";
import type { PropsGroups } from "src/types/app.js";
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

export interface BaseResponseInit {
  type: ResponseType;
  url: string;
  propsGroups?: Partial<Pick<PropsGroups, "global">>;
  title?: string;
  errors?: ErrorBag;
  effects?: Effects;
}

export type ResponsesMap = {
  [ResponseType.VISIT]: [
    typeof VisitResponse,
    VisitResponse,
    VisitResponseInit
  ];
  [ResponseType.FRAGMENT]: [
    typeof FragmentResponse,
    FragmentResponse,
    FragmentResponseInit
  ];
  [ResponseType.AMBIENT]: [
    typeof AmbientResponse,
    AmbientResponse,
    AmbientResponseInit
  ];
  [ResponseType.DATA]: [typeof DataResponse, DataResponse, DataResponseInit];
  [ResponseType.UNHANDLED]: [
    typeof UnhandledResponse,
    UnhandledResponse,
    never
  ];
};

export type ResponseConstructor<T extends ResponseType = ResponseType> =
  ResponsesMap[T][0];

export type ResponseInstance<T extends ResponseType = ResponseType> =
  ResponsesMap[T][1];

export type ResponseInit<T extends ResponseType = ResponseType> =
  ResponsesMap[T][2];

/**
 * Any of the response types that cause a state change.
 * This includes all response types except for `ResponseType.DATA` and `ResponseType.UNHANDLED`.
 */
export type StateChangingResponseType = ResponsesMap[
  | ResponseType.VISIT
  | ResponseType.FRAGMENT
  | ResponseType.AMBIENT][1];

export abstract class Response<
  T extends Exclude<ResponseType, ResponseType.UNHANDLED> = Exclude<
    ResponseType,
    ResponseType.UNHANDLED
  >
> {
  public static isValidType(type: unknown): type is ResponseType {
    switch (S.lower(type)) {
      case ResponseType.VISIT:
      case ResponseType.FRAGMENT:
      case ResponseType.AMBIENT:
      case ResponseType.DATA:
        return true;
      default:
        return false;
    }
  }

  public static unhandled(
    raw: RawResponse,
    reason?: string
  ): UnhandledResponse {
    return new UnhandledResponse(raw, reason);
  }

  public readonly type: T;
  protected readonly url: string;
  protected readonly propsGroups: Partial<PropsGroups>;
  protected readonly title?: string;
  protected readonly errors?: ErrorBag;
  protected readonly effects?: Effects;

  public constructor({
    url,
    type,
    propsGroups,
    title,
    effects,
    errors,
  }: BaseResponseInit) {
    this.type = <T>S.lower(type);
    this.url = S(url);
    this.propsGroups = O.is(propsGroups) ? propsGroups : {};
    this.title = S.is(title) ? title : undefined;
    this.errors = O.is(errors) ? errors : undefined;
    this.effects = A.wrap(effects);
  }

  public getUrl(): string {
    return this.url;
  }

  public getGlobalProps(): PropsGroups["global"] | undefined {
    return this.propsGroups.global;
  }

  public getTitle(): string | undefined {
    return this.title;
  }

  public getErrors(): ErrorBag | undefined {
    return this.errors;
  }

  public getEffects(): Effects | undefined {
    return this.effects;
  }
}
