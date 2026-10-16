const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const AUTH_USER_QUERY_KEY = ["auth-user"] as const;

export interface AuthUser {
  nombreCompleto: string;
  rol: string;
  avatarUrl: string | null;
}

export type AuthResponse = AuthUser;

export interface RegistroPayload {
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  telefono: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function responseError(response: Response): Promise<Error> {
  const body: unknown = await response.json().catch(() => null);

  // Mensajes deliberadamente genéricos para evitar revelar si una cuenta existe.
  if (response.status === 401) {
    return new AuthApiError("No se pudo iniciar sesión. Verifica tus credenciales e inténtalo de nuevo.", response.status);
  }
  if (response.status === 403) {
    return new AuthApiError("No tienes permiso para realizar esta acción.", response.status);
  }
  if (response.status >= 500) {
    return new AuthApiError("Ocurrió un problema. Inténtalo nuevamente más tarde.", response.status);
  }

  let message = "No se pudo completar la solicitud. Revisa los datos e inténtalo de nuevo.";
  if (typeof body === "object" && body !== null) {
    if ("fieldErrors" in body && typeof body.fieldErrors === "object" && body.fieldErrors !== null) {
      const fieldMessages = Object.values(body.fieldErrors)
        .filter((value): value is string => typeof value === "string");
      if (fieldMessages.length > 0) message = fieldMessages.join(" ");
    } else if ("message" in body && typeof body.message === "string") {
      message = body.message;
    } else if ("mensaje" in body && typeof body.mensaje === "string") {
      message = body.mensaje;
    } else if ("error" in body && typeof body.error === "string") {
      message = body.error;
    }
  }
  return new AuthApiError(message, response.status);
}

async function getCsrfToken(): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/auth/csrf`, { credentials: "include" });
  } catch {
    throw new AuthApiError("No se pudo conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.", 0);
  }
  if (!response.ok) throw new Error("No se pudo preparar la solicitud segura.");
  const body: unknown = await response.json();
  if (typeof body !== "object" || body === null || !("token" in body) || typeof body.token !== "string") {
    throw new Error("El servidor no devolvió un token CSRF válido.");
  }
  return body.token;
}

async function postJson<T>(path: string, payload?: unknown): Promise<T> {
  const csrfToken = await getCsrfToken();
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": csrfToken },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
    });
  } catch {
    throw new AuthApiError("No se pudo conectar con el servicio. Revisa tu conexión e inténtalo de nuevo.", 0);
  }
  if (!response.ok) throw await responseError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function registrarCliente(payload: RegistroPayload) {
  return postJson<{ mensaje: string }>("/api/v1/auth/registro", payload);
}

export function iniciarSesion(payload: LoginPayload) {
  return postJson<AuthResponse>("/api/v1/auth/login", payload);
}

export function obtenerUsuarioActual() {
  return fetch(`${API_BASE_URL}/api/v1/auth/me`, { credentials: "include" }).then(async (response) => {
    if (!response.ok) throw await responseError(response);
    return response.json() as Promise<AuthUser>;
  });
}

export function cerrarSesion() {
  return postJson<void>("/api/v1/auth/logout");
}
