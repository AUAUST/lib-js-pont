import { Pont, Service } from "@auaust/pont";
import { describe, expect, test } from "vitest";

describe("Pont can be initialized with services", () => {
  test("passed as Service constructors", () => {
    // When a service is passed as a constructor, each use of the
    // service will create a new instance of it. It allows to
    // conveniently set instance properties in the constructor to
    // be used within the service.

    let thisValue: any;
    let pontValue: any;

    const paramsSerializer = class extends Service<"paramsSerializer"> {
      override handle() {
        thisValue = this;
        pontValue = this.pont;

        return "my=params&serializer=works";
      }
    };

    const pont = Pont.create().init({
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
    // If a service is passed as an instance, it will be used
    // directly. It allows to nicely split up the service logic
    // into methods alike constructors, with a little performance
    // gain since the service won't be instantiated each time at
    // the cost of not being able to set instance properties as a
    // single instance exits for all executions.

    let thisValue: any;
    let pontValue: any;

    const pont = Pont.create();

    const paramsSerializer = class extends Service<"paramsSerializer"> {
      override handle() {
        thisValue = this;
        pontValue = this.pont;

        return "my=params&serializer=works";
      }
    }.create(pont);

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
    // Simple functions may be passed as a service, however
    // since factories and class constructors are also functions,
    // Pont needs a way to tell them apart. To avoid ambiguity,
    // function-based services must be wrapped in another function.
    // { serviceName: myServiceFunction } will not work, but
    // { serviceName: () => myServiceFunction } will work.

    let thisValue: any;

    const paramsSerializer = function (this: Pont) {
      thisValue = this;

      return "my=params&serializer=works";
    };

    let pontValue: any;

    const pont = Pont.create().init({
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
    // Objects with a handle method may be passed as a service.
    // The handle method will be called with the Pont instance
    // as the first argument followed by the arguments passed to
    // the service. The object holding the handle method will be
    // passed as the `this` value of the handle method, allowing to
    // split up the service logic into multiple methods.

    let thisValue: any;
    let pontValue: any;

    const paramsSerializer = {
      handle(pont: Pont) {
        thisValue = this;
        pontValue = pont;

        return this.doTheLogic();
      },

      doTheLogic() {
        return "my=params&serializer=works";
      },
    };

    const pont = Pont.create().init({
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
