const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface Entity {
  id: number
  [key: string]: unknown
}

export interface Product extends Entity {
  sku: string
  nombre: string
  descripcion?: string
  precioBase: number
  maxSabores: number
  stockDisponible: number
  categoriaId: number
  categoria?: string
  saboresIds: number[]
  sabores?: string[]
  urlImagen: string
  pesoVolumen: string
  tipoPresentacion: string
  ofertasIds?: number[]
  precioFinal?: number
  nombreOferta?: string | null
  porcentajeDescuento?: number | null
}

export interface Offer extends Entity {
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  productosIds: number[]
  productos: string[]
  estado: 'PROGRAMADA' | 'VIGENTE' | 'FINALIZADA'
}

export interface Category extends Entity {
  nombre: string
  estado: boolean
}

export interface Flavor extends Entity {
  nombre: string
  colorHex: string
  estadoDisponibilidad: boolean
}

export interface DeliveryZone extends Entity {
  nombreDistrito: string
  costoEnvio: number
  tiempoEstimadoMinutos: number
  estado: boolean
}

export interface Customer extends Entity {
  uuid: string
  nombres: string
  apellidos: string
  email: string
  avatarUrl?: string | null
  dni: string
  telefono: string
  estado?: boolean
}

export interface Administrator extends Entity {
  uuid: string
  nombres: string
  apellidos: string
  email: string
  avatarUrl?: string | null
  nivelAcceso: string
  ultimoAcceso?: string
  estado?: boolean
}

export interface Address extends Entity {
  clienteId: number
  clienteNombre?: string
  zonaId: number
  zona: string
  alias: string
  linea1: string
  linea2?: string
  referencia?: string
  esPrincipal: boolean
}

export interface Order extends Entity {
  uuid: string
  clienteId: number
  clienteNombre: string
  clienteEmail: string
  direccion: string
  subtotal: number
  costoEnvio: number
  igv: number
  total: number
  estadoPago: string
  estadoPedido: string
  detalles: { productoId: number; producto: string; cantidad: number; precioUnitario: number; subtotal: number; sabores: string[] }[]
  createdAt: string
}

export interface StockMovement extends Entity {
  productoId: number
  producto: string
  sku?: string
  cantidadAlterada: number
  tipoMovimiento: string
  observacion?: string
  fechaMovimiento?: string
  administrador: string
}

export type DashboardEntity =
  | Product
  | Offer
  | Category
  | Flavor
  | DeliveryZone
  | Customer
  | Administrator
  | Address
  | Order
  | StockMovement

export class DashboardApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'DashboardApiError'
  }
}

function safeErrorMessage(status: number): string {
  if (status === 401) return 'Tu sesión no está disponible. Inicia sesión nuevamente.'
  if (status === 403) return 'No tienes permiso para realizar esta acción.'
  if (status === 404) return 'No se pudo encontrar el recurso solicitado.'
  if (status === 409) return 'No se pudo completar la acción solicitada.'
  if (status >= 500) return 'Ocurrió un problema. Inténtalo nuevamente más tarde.'
  return 'No se pudo completar la solicitud. Verifica los datos ingresados.'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, credentials: 'include' })
  } catch {
    throw new DashboardApiError('No se pudo conectar con el servicio. Revisa tu conexión.', 0)
  }
  if (!response.ok) {
    let message = safeErrorMessage(response.status)
    try {
      const body = await response.clone().json() as { message?: unknown; mensaje?: unknown; error?: unknown }
      const serverMessage = body.message ?? body.mensaje ?? body.error
      if (typeof serverMessage === 'string' && serverMessage.trim()) message = serverMessage
    } catch { /* Usa el mensaje genérico para respuestas no JSON. */ }
    throw new DashboardApiError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  const body = await response.text()
  if (!body) return undefined as T
  try {
    return JSON.parse(body) as T
  } catch {
    return body as T
  }
}

export async function getList<T>(path: string): Promise<T[]> {
  const result: unknown = await request<unknown>(path)
  if (Array.isArray(result)) return result as T[]
  if (typeof result === 'object' && result !== null) {
    for (const key of ['content', 'data', 'items', 'resultados']) {
      const value = (result as Record<string, unknown>)[key]
      if (Array.isArray(value)) return value as T[]
    }
  }
  throw new DashboardApiError('El servicio devolvió una lista con formato inesperado.', 0)
}

export function getOne<T>(path: string) {
  return request<T>(path)
}

export async function mutate<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: unknown): Promise<T> {
  const csrf = await request<{ token: string }>('/api/v1/auth/csrf')
  if (!csrf || typeof csrf.token !== 'string') {
    throw new DashboardApiError('El servidor no devolvió un token CSRF válido.', 0)
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

export const dashboardPaths = {
  products: '/api/v1/catalogo/productos',
  categories: '/api/v1/catalogo/categorias',
  flavors: '/api/v1/catalogo/sabores',
  zones: '/api/zonas',
  customers: '/api/clientes',
  addresses: '/api/direcciones',
  admins: '/api/v1/admin/administradores',
  orders: '/api/pedidos',
  stockMovements: '/api/v1/admin/stock-movements',
  offers: '/api/v1/admin/ofertas',
} as const
