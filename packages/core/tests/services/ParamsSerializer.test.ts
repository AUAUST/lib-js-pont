import { type NormalizedRequestParameters, Pont } from "@auaust/pont-core";
import { O, P, S } from "@auaust/primitive-kit";
import { describe, expect, test, vitest } from "vitest";

describe("Url parameters", async () => {
  const pont = new Pont().init({
    baseUrl: "https://example.com",
  });

  test("can be passed as a config option", () => {
    const request = pont.getRequestsManager().createRequest("/users/create", {
      params: {
        id: 123,
      },
    });

    expect(request.getUrl()).toBe(
      encodeURI("https://example.com/users/create?id=123")
    );
  });

  test("can be passed in the URL and merged with the config options", () => {
    const request = pont.getRequestsManager().createRequest("/users?limit=10", {
      params: { page: 4 },
    });

    expect(request.getUrl()).toBe(
      encodeURI("https://example.com/users?limit=10&page=4")
    );
  });

  test("supports arrays as bracketed parameters", () => {
    const request = pont.getRequestsManager().createRequest("/users", {
      params: {
        ids: [1, 2, 3],
      },
    });

    expect(request.getUrl()).toBe(
      encodeURI("https://example.com/users?ids[]=1&ids[]=2&ids[]=3")
    );
  });
});

test("Pont can use a custom params serializer", () => {
  const paramsSerializer = {
    serialize: vitest.fn((options: NormalizedRequestParameters) => {
      const params: Record<string, string> = {};

      for (const [key, value] of options) {
        params[key] = P.isPrimitive(value) ? S(value) : JSON.stringify(value);
      }

      return O.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    }),
  };

  const pont = new Pont().init({
    baseUrl: "https://example.com",
    services: {
      paramsSerializer,
    },
  });

  const request = pont
    .getRequestsManager()
    .createRequest("/users?page=3#fragment", {
      params: {
        ids: [1, 2, 3],
      },
    });

  expect(request.getUrl()).toBe(
    "https://example.com/users?page=3&ids=[1,2,3]#fragment"
  );
  expect(paramsSerializer.serialize).toHaveBeenCalled();
  expect(paramsSerializer.serialize).toHaveReturnedWith("page=3&ids=[1,2,3]");

  paramsSerializer.serialize.mockReturnValueOnce("");

  expect(request.getUrl()).toBe("https://example.com/users#fragment");
});
