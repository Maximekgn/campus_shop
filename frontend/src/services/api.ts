const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

type FetchOptions = RequestInit & {
  data?: unknown;
};

async function apiFetch(path: string, options: FetchOptions = {}) {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers ?? {
    "Content-Type": "application/json",
  });

  const init: RequestInit = {
    ...options,
    headers,
    body: options.data ? JSON.stringify(options.data) : options.body,
  };

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (path: string) => apiFetch(path, { method: "GET" }),
  post: (path: string, data: unknown) => apiFetch(path, { method: "POST", data }),
  put: (path: string, data: unknown) => apiFetch(path, { method: "PUT", data }),
  delete: (path: string) => apiFetch(path, { method: "DELETE" }),
};
