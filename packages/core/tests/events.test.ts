import {
  Pont,
  type EventListener,
  type EventListeners,
  type EventName,
  type PontInit,
} from "@auaust/pont";
import { S } from "@auaust/primitive-kit";
import { transporter } from "@core/tests/mocks/Transporter.js";
import { describe } from "node:test";
import { beforeEach, expect, test, vitest } from "vitest";

describe("Pont events", () => {
  const init: PontInit = {
    baseUrl: "https://example.com",
    services: {
      transporter,
    },
  };

  const events = [
    "before",
    "error",
    "exception",
    "finish",
    "prevented",
    "received",
    "start",
    "success",
    "unhandled",
  ] as const satisfies EventName[];

  {
    const pont = Pont.from(init);

    test.each(events)(
      "should expose '%s' event registration methods",
      (event) => {
        const on = `on${S.capitalize(event)}` as const;

        expect(pont[on]).toBeTypeOf("function");
        expect(() => pont.on(event, () => {})).not.toThrow();
      }
    );
  }

  test("can be registered from the init", async () => {
    const onStart = vitest.fn();
    const onFinish = vitest.fn();

    const pont = Pont.from({
      ...init,
      listeners: {
        onStart,
        onFinish,
      },
    });

    await pont.visit("/");

    expect(onStart).toHaveBeenCalledOnce();
    expect(onFinish).toHaveBeenCalledOnce();
  });

  test("can be registered with on-methods", async () => {
    const onStart = vitest.fn();
    const onFinish = vitest.fn();

    const pont = Pont.from(init);

    pont.on("start", onStart);
    pont.onFinish(onFinish);

    await pont.visit("/");

    expect(onStart).toHaveBeenCalledOnce();
    expect(onFinish).toHaveBeenCalledOnce();
  });

  test("are called with the correct this value", async () => {
    const thisValues: any[] = [];

    const pushThis = function (this: Pont) {
      thisValues.push(this);
    };

    const listeners = {
      onBefore: vitest.fn(pushThis),
      onStart: vitest.fn(pushThis),
      onSuccess: vitest.fn(pushThis),
      onFinish: vitest.fn(pushThis),
    } satisfies EventListeners;

    const pont = Pont.from({
      ...init,
      listeners,
    });

    await pont.visit("/");

    expect(thisValues).toHaveLength(4);

    for (const thisValue of thisValues) {
      expect(thisValue).toBe(pont);
    }
  });

  describe("are correctly called", () => {
    const onBefore = vitest.fn<EventListener<"before">>();
    const onPrevented = vitest.fn<EventListener<"prevented">>();
    const onStart = vitest.fn<EventListener<"start">>();
    const onException = vitest.fn<EventListener<"exception">>();
    const onReceived = vitest.fn<EventListener<"received">>();
    const onUnhandled = vitest.fn<EventListener<"unhandled">>();
    const onInvalid = vitest.fn<EventListener<"invalid">>();
    const onSuccess = vitest.fn<EventListener<"success">>();
    const onError = vitest.fn<EventListener<"error">>();
    const onFinish = vitest.fn<EventListener<"finish">>();

    const listeners = {
      onBefore,
      onPrevented,
      onStart,
      onException,
      onReceived,
      onUnhandled,
      onInvalid,
      onSuccess,
      onError,
      onFinish,
    } satisfies EventListeners;

    beforeEach(vitest.clearAllMocks);

    test("when the request is prevented", async () => {
      const pont = Pont.from({
        ...init,
        listeners,
      });

      onBefore.mockImplementationOnce((event) => {
        event.preventDefault();
      });

      await pont.visit("/");

      expect(onBefore).toHaveBeenCalledOnce();
      expect(onPrevented).toHaveBeenCalledAfter(onBefore);
      expect(onStart).not.toHaveBeenCalled();
      expect(onException).not.toHaveBeenCalled();
      expect(onReceived).not.toHaveBeenCalled();
      expect(onUnhandled).not.toHaveBeenCalled();
      expect(onInvalid).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onFinish).not.toHaveBeenCalled();
    });

    test("when the request is successful", async () => {
      const pont = Pont.from({
        ...init,
        listeners,
      });

      await pont.visit("/");

      expect(onBefore).toHaveBeenCalledOnce();
      expect(onStart).toHaveBeenCalledAfter(onBefore);
      expect(onReceived).toHaveBeenCalledAfter(onStart);
      expect(onSuccess).toHaveBeenCalledAfter(onReceived);
      expect(onFinish).toHaveBeenCalledAfter(onSuccess);

      expect(onPrevented).not.toHaveBeenCalled();
      expect(onException).not.toHaveBeenCalled();
      expect(onUnhandled).not.toHaveBeenCalled();
      expect(onInvalid).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    // test.only("when the request returns 404", async () => {
    //   const pont = Pont.from({
    //     ...init,
    //     listeners,
    //   });

    //   await pont.visit("/not-found");

    //   expect(onBefore).toHaveBeenCalledOnce();
    //   expect(onStart).toHaveBeenCalledAfter(onBefore);
    //   expect(onReceived).toHaveBeenCalledAfter(onStart);
    //   expect(onError).toHaveBeenCalledAfter(onReceived);
    //   expect(onFinish).toHaveBeenCalledAfter(onError);

    //   expect(onPrevented).not.toHaveBeenCalled();
    //   expect(onException).not.toHaveBeenCalled();
    //   expect(onUnhandled).not.toHaveBeenCalled();
    //   expect(onInvalid).not.toHaveBeenCalled();
    //   expect(onSuccess).not.toHaveBeenCalled();
    // });
  });
});
