import { N } from "@auaust/primitive-kit";
import type { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import type { EmptyResponse } from "@core/src/classes/Responses/EmptyResponse.js";
import type { PartialResponse } from "@core/src/classes/Responses/PartialResponse.js";
import { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import type { VisitResponse } from "@core/src/classes/Responses/VisitResponse.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import { isResponseType, ResponseType } from "@core/src/enums/ResponseType.js";

export type ResponseInstance<T extends ResponseType = ResponseType> =
  | ValidResponseInstance
  | UnhandledResponse;

export type ValidResponseInstance = NavigationResponseInstance | DataResponse;

export type NavigationResponseInstance =
  | VisitResponse
  | PartialResponse
  | EmptyResponse;

export interface BaseResponseInit {
  url: URL | string;
  status: number;
  headers: HeadersInit;
}

export abstract class Response extends Creatable() {
  public readonly status: number;
  public readonly url: string;
  public readonly headers: Headers;

  public constructor({ url, headers, status }: BaseResponseInit) {
    super();

    this.status = status;
    this.url = url.toString();
    this.headers = new Headers(headers);
  }

  public isOk(): boolean {
    return N.isBetween(this.status, 200, 299);
  }

  public isClientError(): boolean {
    return N.isBetween(this.status, 400, 499);
  }

  public isServerError(): boolean {
    return N.isBetween(this.status, 500, 599);
  }

  public isNavigation(): this is NavigationResponseInstance {
    return "mode" in this && this.mode === ExchangeMode.NAVIGATION;
  }

  public isData(): this is DataResponse {
    return "mode" in this && this.mode === ExchangeMode.DATA;
  }

  public isUnhandled(): this is UnhandledResponse {
    return "type" in this && this.type === ResponseType.UNHANDLED;
  }

  public isValid(): this is ValidResponseInstance {
    return (
      "type" in this &&
      isResponseType(this.type) &&
      this.type !== ResponseType.UNHANDLED
    );
  }

  public isPartial(): this is PartialResponse {
    return "type" in this && this.type === ResponseType.PARTIAL;
  }

  public isEmpty(): this is EmptyResponse {
    return "type" in this && this.type === ResponseType.EMPTY;
  }

  public isVisit(): this is VisitResponse {
    return "type" in this && this.type === ResponseType.VISIT;
  }
}
