/* eslint-disable @typescript-eslint/no-explicit-any, turbo/no-undeclared-env-vars, no-console */
export const fetcher = async (
  url: string,
  options?: RequestInit,
  mockPath?: string
): Promise<Response> => {
  let useMock = false;
  let debugMock = false;

  // Check Vite environment variable
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_DEBUG_MOCK_API === "true"
  ) {
    debugMock = true;
  }

  // Check process environment variables
  if (typeof process !== "undefined" && process.env) {
    if (
      process.env.VITE_DEBUG_MOCK_API === "true" ||
      process.env.NEXT_PUBLIC_DEBUG_MOCK_API === "true" ||
      process.env.DEBUG_MOCK_API === "true"
    ) {
      debugMock = true;
    }
  }

  // Check global window as fallback
  if (
    typeof window !== "undefined" &&
    (window as any).VITE_DEBUG_MOCK_API === "true"
  ) {
    debugMock = true;
  }

  // Check Vite environment variable
  if (
    typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    (import.meta as any).env.VITE_USE_MOCK_API === "true"
  ) {
    useMock = true;
  }

  // Check process environment variables
  if (typeof process !== "undefined" && process.env) {
    if (
      process.env.VITE_USE_MOCK_API === "true" ||
      process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
    ) {
      useMock = true;
    }
  }

  // Check global window as fallback
  if (
    typeof window !== "undefined" &&
    (window as any).VITE_USE_MOCK_API === "true"
  ) {
    useMock = true;
  }

  if (useMock && mockPath) {
    // Ensure mock path starts with slash or doesn't, we will assume it does not start with slash in the consumer calls
    const normalizedMockPath = mockPath.startsWith("/")
      ? mockPath
      : `/${mockPath}`;
    const mockUrl = `/mocks${normalizedMockPath}.json`;
    if (debugMock) {
      console.log(
        `[API Mock] Intercepted call to ${url}. Fetching mock at ${mockUrl}`
      );
    }

    try {
      const mockResponse = await fetch(mockUrl);
      if (mockResponse.ok) {
        return mockResponse;
      }
      if (debugMock) {
        console.warn(
          `[API Mock] Enabled but failed to fetch mock file at ${mockUrl}. Status: ${mockResponse.status}. Falling back to live API.`
        );
      }
    } catch (e) {
      if (debugMock) {
        console.warn(`[API Mock] Error fetching mock file at ${mockUrl}`, e);
      }
    }
  }

  // Fallback to real fetch if mock is not enabled, or if fetching mock failed
  return fetch(url, options);
};
