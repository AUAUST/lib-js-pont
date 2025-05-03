let isServer: boolean | undefined;

function getCallingFunctionName(): string {
  const stack = new Error().stack;

  if (!stack) return "unknown";

  return stack.split("\n")[1].trim() || "unknown";
}

/**
 * Throws an error if the code is not running on the client.
 */
export function mustRunOnClient(fn?: string) {
  if ((isServer ??= typeof window !== "undefined")) {
    throw new Error(
      `The function "${
        fn ?? getCallingFunctionName()
      }" must be called on the client side.`
    );
  }
}

/**
 * Throws an error if the code is not running on the server.
 */
export function mustRunOnServer(fn?: string) {
  if ((isServer ??= typeof window === "undefined")) {
    throw new Error(
      `The function "${
        fn ?? getCallingFunctionName()
      }" must be called on the server side.`
    );
  }
}
