import { Pont, Service } from "@auaust/pont";
import { describe, expect, test } from "vitest";

describe("Pont can be initialized with services", () => {
  test("passed as Service constructors", () => {
    let thisValue: any;
    let pontValue: any;

    const paramsSerializer = class extends Service<"paramsSerializer"> {
      override handle() {
        thisValue = this;
        pontValue = this.pont;

        return "my=params&serializer=works";
      }
    };

    const pont = new Pont().init({
      baseUrl: "https://example.com",
      services: {
        paramsSerializer,
      },
    });

    expect(pont.createUrl("").toString()).toBe(
      "https://example.com/?my=params&serializer=works"
    );

    expect(thisValue).toBeInstanceOf(paramsSerializer);
    expect(pontValue).toBe(pont);
  });

  test("passed as Service instances", () => {
    let thisValue: any;
    let pontValue: any;

    const pont = new Pont();

    const paramsSerializer = new (class extends Service<"paramsSerializer"> {
      override handle() {
        thisValue = this;
        pontValue = this.pont;

        return "my=params&serializer=works";
      }
    })(pont);

    pont.init({
      baseUrl: "https://example.com",
      services: {
        paramsSerializer,
      },
    });

    expect(pont.createUrl("").toString()).toBe(
      "https://example.com/?my=params&serializer=works"
    );

    expect(thisValue).toBe(paramsSerializer);
    expect(pontValue).toBe(pont);
  });

  test("passed as functions", () => {
    let thisValue: any;

    const paramsSerializer = function (this: Pont) {
      thisValue = this;

      return "my=params&serializer=works";
    };

    let pontValue: any;

    const pont = new Pont().init({
      baseUrl: "https://example.com",
      services: {
        paramsSerializer: (pont: Pont) => {
          pontValue = pont;

          return paramsSerializer;
        },
      },
    });

    expect(pont.createUrl("").toString()).toBe(
      "https://example.com/?my=params&serializer=works"
    );

    expect(thisValue).toBe(pont);
    expect(pontValue).toBe(pont);
  });

  test("passed as objects with handle method", () => {
    let thisValue: any;
    let pontValue: any;

    const paramsSerializer = {
      handle(pont: Pont) {
        thisValue = this;
        pontValue = pont;

        return "my=params&serializer=works";
      },
    };

    const pont = new Pont().init({
      baseUrl: "https://example.com",
      services: {
        paramsSerializer,
      },
    });

    expect(pont.createUrl("").toString()).toBe(
      "https://example.com/?my=params&serializer=works"
    );

    expect(thisValue).toBe(paramsSerializer);
    expect(pontValue).toBe(pont);
  });
});
