import { Pont } from "@auaust/pont-core";
import { describe, expect, test } from "vitest";

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
      encodeURI("https://example.com/users?page=4&limit=10")
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
