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

interface LoginResponse extends AuthUser {
  token: string;
}

function readToken(): string | null {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

function saveToken(token: string | null) {
  try {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  } catch {
    throw new Error("No se pudo guardar la sesión en este navegador.");
  }
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
  const message =
    typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
      ? body.message
      : typeof body === "object" && body !== null && "mensaje" in body && typeof body.mensaje === "string"
        ? body.mensaje
        : `La solicitud falló (${response.status}).`;
  return new AuthApiError(message, response.status);
}

async function postJson<T>(path: string, payload?: unknown, authenticated = false): Promise<T> {
  const token = authenticated ? readToken() : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });

  if (!response.ok) throw await responseError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function registrarCliente(payload: RegistroPayload) {
  return postJson<{ mensaje: string }>("/api/v1/auth/registro", payload);
}

export async function iniciarSesion(payload: LoginPayload) {
  const response = await postJson<LoginResponse>("/api/v1/auth/login", payload);
  saveToken(response.token);
  const { token: _token, ...user } = response;
  return user;
}

export function obtenerUsuarioActual() {
  const token = readToken();
  if (!token) return Promise.reject(new AuthApiError("No hay una sesión activa.", 401));
  return fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (response) => {
    if (!response.ok) throw await responseError(response);
    return response.json() as Promise<AuthUser>;
  });
}

export function cerrarSesion() {
  saveToken(null);
  return Promise.resolve();
}
