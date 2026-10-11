export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function extractErrorMessage(
  body: unknown,
  path: string,
  status: number,
): string {
  const rawError = (body as { error?: unknown } | null)?.error;
  if (typeof rawError === "string") return rawError;
  if (rawError && typeof rawError === "object") {
    return Object.values(rawError as Record<string, unknown>)
      .flat()
      .join(" ");
  }
  return `Permintaan ke ${path} gagal (${status})`;
}

export async function fetchFromApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      extractErrorMessage(body, path, response.status),
      response.status,
    );
  }
  return response.json() as Promise<T>;
}
