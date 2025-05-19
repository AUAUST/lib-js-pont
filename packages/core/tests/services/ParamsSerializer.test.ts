import { Pont, type Request } from "@auaust/pont";
import { describe, expect, test } from "vitest";

describe("Url parameters", async () => {
  const pont = Pont.create().init({
    baseUrl: "https://example.com",
  });

  test.only("can be passed as a config option", async () => {
    let request!: Request;

    pont.onBefore(({ detail }) => ((request = detail.request), false));

    await pont.visit("/users/create", {
      params: {
        id: 123,
      },
    });

    expect(request.getUrl()).toBe(
      encodeURI("https://example.com/users/create?id=123")
    );
  });

  //   test("can be passed in the URL and merged with the config options", () => {
  //     const request = pont.createNavigationRequest("/users?limit=10", {
  //       params: { page: 4 },
  //     });

  //     expect(request.getUrl()).toBe(
  //       encodeURI("https://example.com/users?limit=10&page=4")
  //     );
  //   });

  //   test("supports arrays as bracketed parameters", () => {
  //     const request = pont.createNavigationRequest("/users", {
  //       params: {
  //         ids: [1, 2, 3],
  //       },
  //     });

  //     expect(request.getUrl()).toBe(
  //       encodeURI("https://example.com/users?ids[]=1&ids[]=2&ids[]=3")
  //     );
  //   });
  // });

  // test("Pont can use a custom params serializer", () => {
  //   const paramsSerializer = {
  //     handle: vitest.fn((pont, options: NormalizedUrlParams) => {
  //       const params: Record<string, string> = {};

  //       for (const [key, value] of options) {
  //         params[key] = P.isPrimitive(value) ? S(value) : JSON.stringify(value);
  //       }

  //       return O.entries(params)
  //         .map(([key, value]) => `${key}=${value}`)
  //         .join("&");
  //     }),
  //   };

  //   const pont = Pont.create().init({
  //     baseUrl: "https://example.com",
  //     services: {
  //       paramsSerializer,
  //     },
  //   });

  //   const request = pont
  //     .getRequestsManager()
  //     .createNavigationRequest("/users?page=3#fragment", {
  //       params: {
  //         ids: [1, 2, 3],
  //       },
  //     });

  //   expect(request.getUrl()).toBe(
  //     "https://example.com/users?page=3&ids=[1,2,3]#fragment"
  //   );
  //   expect(paramsSerializer.handle).toHaveBeenCalled();
  //   expect(paramsSerializer.handle).toHaveReturnedWith("page=3&ids=[1,2,3]");

  //   paramsSerializer.handle.mockReturnValueOnce("");

  //   expect(request.getUrl()).toBe("https://example.com/users#fragment");
});
