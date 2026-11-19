const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface CheckoutAddress {
  id: number
  clienteId: number
  clienteNombre: string
  zonaId: number
  zona: string
  alias: string
  linea1: string
  linea2: string | null
  referencia: string | null
  esPrincipal: boolean
}

export interface CheckoutAddressPayload {
  zonaId: number
  alias: string
  linea1: string
  linea2: string
  referencia: string
  esPrincipal: boolean
}

export interface CheckoutDeliveryZone {
  id: number
  nombreDistrito: string
  costoEnvio: number
  tiempoEstimadoMinutos: number | null
}

export interface CheckoutOrderPayload {
  direccionId: number
  detalles: { productoId: number; cantidad: number }[]
}

export interface CheckoutOrder {
  id: number
  uuid: string
  subtotal: number
  costoEnvio: number
  igv: number
  total: number
  estadoPago: string
  estadoPedido: string
}

export class CheckoutApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'CheckoutApiError'
    this.status = status
  }
}

function publicErrorMessage(status: number) {
  if (status === 401) return 'Inicia sesión con tu cuenta de cliente para continuar.'
  if (status === 403) return 'Esta acción no está permitida para tu cuenta.'
  if (status === 404) return 'No se encontró la dirección o el recurso solicitado.'
  if (status === 409) return 'El pedido cambió. Actualiza el carrito e inténtalo nuevamente.'
  if (status === 400) return 'Revisa los datos de entrega y la disponibilidad de los productos.'
  return 'No se pudo completar la solicitud. Inténtalo nuevamente más tarde.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
    })
  } catch {
    throw new CheckoutApiError('No se pudo conectar con el servicio. Revisa tu conexión.', 0)
  }
  if (!response.ok) throw new CheckoutApiError(publicErrorMessage(response.status), response.status)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

async function mutate<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: unknown): Promise<T> {
  const csrf = await request<{ token: string }>('/api/v1/auth/csrf')
  if (!csrf || typeof csrf.token !== 'string') {
    throw new CheckoutApiError('No se pudo preparar la solicitud segura.', 0)
  }
  return request<T>(path, {
    method,
    headers: {
      'X-XSRF-TOKEN': csrf.token,
      ...(payload === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  })
}

export function getDeliveryZones() {
  return request<CheckoutDeliveryZone[]>('/api/zonas')
}

export function getMyAddresses() {
  return request<CheckoutAddress[]>('/api/v1/cliente/direcciones')
}

export function createMyAddress(payload: CheckoutAddressPayload) {
  return mutate<CheckoutAddress>('/api/v1/cliente/direcciones', 'POST', payload)
}

export function updateMyAddress(id: number, payload: CheckoutAddressPayload) {
  return mutate<CheckoutAddress>(`/api/v1/cliente/direcciones/${id}`, 'PUT', payload)
}

export function deleteMyAddress(id: number) {
  return mutate<void>(`/api/v1/cliente/direcciones/${id}`, 'DELETE')
}

export function createCheckoutOrder(payload: CheckoutOrderPayload) {
  return mutate<CheckoutOrder>('/api/pedidos/checkout', 'POST', payload)
}
