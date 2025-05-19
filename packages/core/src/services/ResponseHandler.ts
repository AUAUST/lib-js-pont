import { A, B, N, O, S } from "@auaust/primitive-kit";
import type { Request } from "@core/src/classes/Request.js";
import { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import { type ResponseInstance } from "@core/src/classes/Responses/Response.js";
import { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import { Service } from "@core/src/classes/Service.js";
import { ExchangeType } from "@core/src/enums/ExchangeType.js";
import { Header } from "@core/src/enums/Header.js";
import { isResponseType, ResponseType } from "@core/src/enums/ResponseType.js";
import type { ResponseParcel } from "@core/src/services/Transporter.js";
import { EmptyResponse } from "../classes/Responses/EmptyResponse.js";
import { PartialResponse } from "../classes/Responses/PartialResponse.js";
import { VisitResponse } from "../classes/Responses/VisitResponse.js";
import { Effects } from "../types/effects.js";

/**
 * Handles a raw response from the server and converts it into a usable format.
 * It is responsible for composing the partial responses, extracting the
 * various data parts, and returning a standardized response object.
 */
export type ResponseHandlerSignature = (
  request: Request,
  parcel: ResponseParcel
) => ResponseInstance;

export class ResponseHandlerService extends Service<"responseHandler"> {
  protected request!: Request;
  protected parcel!: ResponseParcel;
  protected type!: ExchangeType;
  protected status!: number;
  protected url!: URL;
  protected headers!: Headers;
  protected data!: unknown;
  protected json?: any;

  public override handle(request: Request, parcel: ResponseParcel) {
    this.request = request;
    this.parcel = parcel;

    try {
      this.prepare();

      if (this.type === ExchangeType.DATA) {
        return this.handleDataResponse();
      }

      if (this.type === ExchangeType.NAVIGATION) {
        return this.handleNavigationResponse();
      }
    } catch (error) {
      return UnhandledResponse.create({
        ...parcel,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }

    return UnhandledResponse.create({
      ...parcel,
      error: new Error("Invalid response type"),
    });
  }

  protected prepare(): void {
    this.headers = this.parseHeaders();

    this.ensurePontResponse();

    this.type = this.parseExchangeType();
    this.status = this.parseStatus();
    this.url = this.parseUrl();
    this.json = this.parseJson();
  }

  protected ensurePontResponse(): void {
    const pont = this.headers.get(Header.PONT);

    // If the header is not exactly set to `1` or `true`, it's not a valid Pont response.
    if (!B.isLoose(pont) || !B.from(pont)) {
      throw new Error("The response does not contain the x-pont header");
    }
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

  protected parseExchangeType(): ExchangeType {
    const responseType = this.headers.get(Header.TYPE);
    const requestType = this.request.getType();

    if (
      responseType === ExchangeType.NAVIGATION &&
      requestType === responseType
    ) {
      return ExchangeType.NAVIGATION;
    }

    if (responseType === ExchangeType.DATA && requestType === responseType) {
      return ExchangeType.DATA;
    }

    if (
      responseType === ExchangeType.DATA &&
      requestType === ExchangeType.NAVIGATION
    ) {
      throw new Error("A data response was received from a navigation request");
    }

    if (
      responseType === ExchangeType.NAVIGATION &&
      requestType === ExchangeType.DATA
    ) {
      throw new Error("A navigation response was received from a data request");
    }

    throw new Error("An invalid response type was received");
  }

  protected parseJson(): object | undefined {
    if (this.headers.get("content-type") !== "application/json") {
      return undefined;
    }

    const data = this.parcel.data;

    if (S.is(data)) {
      return JSON.parse(data);
    }

    if (O.isStrict(data)) {
      return data;
    }
  }

  protected handleDataResponse(): DataResponse {
    return DataResponse.create({
      url: this.url,
      status: this.status,
      headers: this.headers,
      data: this.json ?? this.parcel.data,
    });
  }

  protected handleNavigationResponse(): ResponseInstance {
    const type = this.getResponseType();

    if (type === ResponseType.VISIT) {
      return VisitResponse.create({
        url: this.url,
        status: this.status,
        headers: this.headers,
        page: this.getPage(),
        layout: this.getLayout(),
        propsGroups: {
          page: this.getPageProps(),
          layout: this.getLayoutProps(),
          global: this.getGlobalProps(),
        },
        effects: this.getEffects(),
      });
    }

    if (type === ResponseType.PARTIAL) {
      return PartialResponse.create({
        url: this.url,
        status: this.status,
        headers: this.headers,
        intendedPage: this.getIntendedPage(),
        propsGroups: {
          page: this.getPageProps(),
          layout: this.getLayoutProps(),
          global: this.getGlobalProps(),
        },
        effects: this.getEffects(),
      });
    }

    if (type === ResponseType.EMPTY) {
      return EmptyResponse.create({
        url: this.url,
        status: this.status,
        headers: this.headers,
        effects: this.getEffects(),
      });
    }

    return UnhandledResponse.create({
      url: this.url,
      status: this.status,
      headers: this.headers,
      reason: "The response does not contain a valid type",
    });
  }

  protected getResponseType(): ResponseType {
    const type = this.json?.type;

    if (isResponseType(type)) {
      return type;
    }

    throw new Error("The response does not contain a valid type");
  }

  protected getPage() {
    const page = this.json?.page;

    if (S.is(page)) {
      return page;
    }

    throw new Error("The response does not contain a valid page");
  }

  protected getLayout() {
    const layout = this.json?.layout;

    return S.is(layout) ? layout : undefined;
  }

  protected getIntendedPage() {
    const page = this.json?.intendedPage;

    if (S.is(page)) {
      return page;
    }

    throw new Error("The response does not contain a valid intended page");
  }

  protected getGlobalProps() {
    return this.json?.propsGroups?.global;
  }

  protected getLayoutProps() {
    return this.json?.propsGroups?.layout;
  }

  protected getPageProps() {
    return this.json?.propsGroups?.page;
  }

  protected getEffects(): Effects {
    return A.wrap(this.json?.effects);
  }
}
