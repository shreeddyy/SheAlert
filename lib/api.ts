export interface ApiError {
  error: string
}

export async function apiRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("shealert_token") : null
  const headers = new Headers(init.headers)

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const fallback = { error: "Request failed" }
    const data = (await response.json().catch(() => fallback)) as ApiError
    throw new Error(data.error ?? fallback.error)
  }

  return response.json() as Promise<T>
}
