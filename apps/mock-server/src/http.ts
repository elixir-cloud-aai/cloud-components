// Types and helpers shared by the server and the route handlers

import type { IncomingHttpHeaders } from "node:http";

import type { Store } from "./store.ts";

// An error that the server sends to the client with its status and message
// (GA4GH error format: `{"msg": ..., "status_code": ...}`). Any other error
// that a handler throws becomes a 500 without details
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export interface RequestContext {
  method: string;
  // Path without the query string
  path: string;
  // Decoded values of the `:name` segments of the route's pattern
  params: Record<string, string>;
  query: URLSearchParams;
  headers: IncomingHttpHeaders;
  // Raw body (empty if there is none); see `parseJson`
  body: Buffer;
  store: Store;
}

export interface Reply {
  status: number;
  // Sent as JSON unless `undefined` (no body)
  body?: unknown;
  headers?: Record<string, string>;
}

export type Handler = (ctx: RequestContext) => Reply | Promise<Reply>;

// The body parsed as JSON, or `undefined` if there is none; 400 if it isn't
// JSON
export const parseJson = (ctx: RequestContext): unknown => {
  if (ctx.body.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(ctx.body.toString("utf8"));
  } catch {
    throw new HttpError(400, "The request body is not valid JSON");
  }
};
