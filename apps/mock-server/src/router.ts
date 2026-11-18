// Minimal router: exact path segments and `:name` parameters, e.g.
// `/ga4gh/wes/v1/runs/:runId`

import { HttpError, type Handler } from "./http.ts";

interface Route {
  method: string;
  segments: string[];
  handler: Handler;
}

export interface Match {
  handler: Handler;
  params: Record<string, string>;
}

// Empty segments (leading, trailing or double slashes) are ignored
const split = (path: string): string[] =>
  path.split("/").filter((segment) => segment !== "");

const decode = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    throw new HttpError(400, "Malformed path encoding");
  }
};

export class Router {
  #routes: Route[] = [];

  add(method: string, pattern: string, handler: Handler): this {
    this.#routes.push({ method, segments: split(pattern), handler });
    return this;
  }

  get(pattern: string, handler: Handler): this {
    return this.add("GET", pattern, handler);
  }

  post(pattern: string, handler: Handler): this {
    return this.add("POST", pattern, handler);
  }

  put(pattern: string, handler: Handler): this {
    return this.add("PUT", pattern, handler);
  }

  delete(pattern: string, handler: Handler): this {
    return this.add("DELETE", pattern, handler);
  }

  // The first route that matches, in the order they were added
  match(method: string, path: string): Match | undefined {
    const segments = split(path).map(decode);
    for (const route of this.#routes) {
      if (
        route.method !== method ||
        route.segments.length !== segments.length
      ) {
        continue;
      }
      const params: Record<string, string> = {};
      const matches = route.segments.every((segment, i) => {
        if (segment.startsWith(":")) {
          params[segment.slice(1)] = segments[i];
          return true;
        }
        return segment === segments[i];
      });
      if (matches) {
        return { handler: route.handler, params };
      }
    }
    return undefined;
  }
}
