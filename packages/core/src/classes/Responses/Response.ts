import { A, N, O, S } from "@auaust/primitive-kit";
import type {
  DataResponse,
  DataResponseInit,
} from "@core/src/classes/Responses/DataResponse.js";
import type {
  EmptyResponse,
  EmptyResponseInit,
} from "@core/src/classes/Responses/EmptyResponse.js";
import type {
  PartialResponse,
  PartialResponseInit,
} from "@core/src/classes/Responses/PartialResponse.js";
import type { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import type {
  VisitResponse,
  VisitResponseInit,
} from "@core/src/classes/Responses/VisitResponse.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { Effects } from "@core/src/types/effects.js";
import type { ErrorBag } from "@core/src/types/errors.js";

export interface BaseResponseInit {
  type: ResponseType;
  url: string;
  status: number;
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
  [ResponseType.PARTIAL]: [
    typeof PartialResponse,
    PartialResponse,
    PartialResponseInit
  ];
  [ResponseType.EMPTY]: [
    typeof EmptyResponse,
    EmptyResponse,
    EmptyResponseInit
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

export type ValidResponseInstance = Exclude<
  ResponseInstance,
  UnhandledResponse
>;

export type ResponseInit<T extends ResponseType = ResponseType> =
  ResponsesMap[T][2];

/**
 * Any of the response types that cause a state change.
 * This includes all response types except for `ResponseType.DATA` and `ResponseType.UNHANDLED`.
 */
export type StateChangingResponseType = ResponsesMap[
  | ResponseType.VISIT
  | ResponseType.PARTIAL
  | ResponseType.EMPTY][1];

export abstract class Response<
  T extends Exclude<ResponseType, ResponseType.UNHANDLED> = Exclude<
    ResponseType,
    ResponseType.UNHANDLED
  >
> extends Creatable() {
  public static isValidType(type: unknown): type is ResponseType {
    switch (S.lower(type)) {
      case ResponseType.VISIT:
      case ResponseType.PARTIAL:
      case ResponseType.EMPTY:
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
    return UnhandledResponse.create(raw, reason);
  }

  public readonly type: T;
  protected readonly status: number;
  protected readonly url: string;
  protected readonly propsGroups: Partial<PropsGroups>;
  protected readonly title?: string;
  protected readonly errors?: ErrorBag;
  protected readonly effects?: Effects;

  public constructor({
    url,
    type,
    status,
    propsGroups,
    title,
    effects,
    errors,
  }: BaseResponseInit) {
    super();

    this.url = S(url);
    this.type = <T>S.lower(type);
    this.status = status;
    this.propsGroups = O.is(propsGroups) ? propsGroups : {};
    this.title = S.is(title) ? title : undefined;
    this.errors = O.is(errors) ? errors : undefined;
    this.effects = A.wrap(effects);
  }

  public getType(): T {
    return this.type;
  }

  public getStatus(): number {
    return this.status;
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

  public hasErrors(): boolean {
    return O.is(this.errors) && O.keys(this.errors).length > 0;
  }

  public getEffects(): Effects | undefined {
    return this.effects;
  }

  public isValid(): boolean {
    return N.isBetween(this.status, 200, 299);
  }

  public hasClientError(): boolean {
    return N.isBetween(this.status, 400, 499);
  }

  public hasServerError(): boolean {
    return N.isBetween(this.status, 500, 599);
  }
}
