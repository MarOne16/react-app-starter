import type { z } from "zod";
import { env } from "@/config/env";

export class HttpError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(`${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Thin fetch wrapper: resolves relative paths against VITE_BACKEND_URL,
 * sends/receives JSON and throws `HttpError` on a non-2xx response.
 */
export async function request<T = unknown>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(new URL(path, `${env.VITE_BACKEND_URL}/`), {
    credentials: "include",
    ...init,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, payload);
  }

  return payload as T;
}

/** Default SWR fetcher — `useSWR("/users", fetcher)`. */
export const fetcher = <T = unknown>(path: string) => request<T>(path);

/**
 * SWR fetcher that validates the response against a Zod schema, so bad data
 * fails loudly at the boundary instead of somewhere deep in a component.
 */
export function schemaFetcher<S extends z.ZodType>(schema: S) {
  return async (path: string): Promise<z.infer<S>> =>
    schema.parse(await request(path));
}
