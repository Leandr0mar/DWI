import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Activity, AlertTriangle, Bell, CheckCircle2, ChevronDown, Clock3, DollarSign, History, LayoutDashboard, LogOut,
  MapPin, Menu, Package, Pencil, Plus, Search, ShoppingBag, Tags, Trash2, UserRound, UsersRound, X,
  type LucideIcon,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logoCremissimo from '../../assets/logo/img_logo3.png'
import { AUTH_USER_QUERY_KEY, AuthApiError, cerrarSesion } from '../../services/auth'
import {
  dashboardPaths, getList, getOne, mutate,
  DashboardApiError, type Address, type Administrator, type Category, type Customer, type DashboardEntity,
  type DeliveryZone, type Flavor, type Order, type Product, type StockMovement,
  type Offer,
} from '../../services/dashboard-api'
import './dashboard.css'

type SectionId = 'products' | 'offers' | 'categories' | 'flavors' | 'inventory' | 'stock-history' | 'orders' | 'customers' | 'addresses' | 'users' | 'delivery'
type FormValue = string | boolean | string[]
type FormValues = Record<string, FormValue>
type DashboardDialogState = {
  kind: 'confirm' | 'success' | 'error'
  title: string
  message: string
  confirmLabel?: string
  onConfirm?: () => void
}
type Field = {
  key: string
  label: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password' | 'url' | 'date' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'color'
  required?: boolean
  options?: { value: string; label: string; colorHex?: string }[]
  step?: string
  min?: string
  max?: string
  hint?: string
}
type Column = { key: string; label: string }
type Section = {
  id: SectionId
  title: string
  singular: string
  description: string
  icon: LucideIcon
  columns: Column[]
  readOnly?: boolean
  create?: boolean
  edit?: boolean
  remove?: boolean
}

const sections: Section[] = [
  { id: 'products', title: 'Productos', singular: 'producto', description: 'Administra el catálogo y las existencias.', icon: Package, create: true, edit: true, remove: true, columns: [{ key: 'nombre', label: 'Producto' }, { key: 'sku', label: 'SKU' }, { key: 'categoria', label: 'Categoría' }, { key: 'precioBase', label: 'Precio final' }, { key: 'stockDisponible', label: 'Stock' }] },
  { id: 'offers', title: 'Ofertas', singular: 'oferta', description: 'Programa descuentos por producto y vigencia.', icon: Tags, create: true, edit: true, remove: true, columns: [{ key: 'nombre', label: 'Oferta' }, { key: 'porcentaje', label: 'Descuento' }, { key: 'fechaInicio', label: 'Desde' }, { key: 'fechaFin', label: 'Hasta' }, { key: 'productos', label: 'Productos' }, { key: 'estado', label: 'Estado' }] },
  { id: 'categories', title: 'Categorías', singular: 'categoría', description: 'Organiza los productos en colecciones.', icon: Tags, create: true, edit: true, remove: true, columns: [{ key: 'nombre', label: 'Categoría' }, { key: 'estado', label: 'Estado' }] },
  { id: 'flavors', title: 'Sabores', singular: 'sabor', description: 'Gestiona los sabores disponibles para los productos.', icon: Activity, create: true, edit: true, remove: true, columns: [{ key: 'nombre', label: 'Sabor' }, { key: 'colorHex', label: 'Color' }, { key: 'estadoDisponibilidad', label: 'Disponibilidad' }] },
  { id: 'inventory', title: 'Stock actual', singular: 'producto', description: 'Consulta las existencias y actualízalas editando un producto o registrando un movimiento.', icon: Package, columns: [{ key: 'nombre', label: 'Producto' }, { key: 'sku', label: 'SKU' }, { key: 'categoria', label: 'Categoría' }, { key: 'stockDisponible', label: 'Existencias' }] },
  { id: 'stock-history', title: 'Historial de stock', singular: 'movimiento', description: 'Historial inmutable de movimientos de inventario.', icon: History, create: true, columns: [{ key: 'fechaMovimiento', label: 'Fecha y hora' }, { key: 'producto', label: 'Producto' }, { key: 'tipoMovimiento', label: 'Movimiento' }, { key: 'cantidadAlterada', label: 'Cantidad' }, { key: 'administrador', label: 'Registrado por' }, { key: 'observacion', label: 'Observación' }] },
  { id: 'orders', title: 'Pedidos', singular: 'pedido', description: 'Crea pedidos y administra estados de envío y pago.', icon: ShoppingBag, create: true, columns: [{ key: 'id', label: 'Pedido' }, { key: 'clienteNombre', label: 'Cliente' }, { key: 'createdAt', label: 'Fecha' }, { key: 'total', label: 'Total' }, { key: 'estadoPedido', label: 'Envío' }, { key: 'estadoPago', label: 'Pago' }] },
  { id: 'customers', title: 'Clientes', singular: 'cliente', description: 'Administra clientes y sus direcciones registradas.', icon: UsersRound, create: true, edit: true, remove: true, columns: [{ key: 'avatarUrl', label: 'Avatar' }, { key: 'nombreCompleto', label: 'Cliente' }, { key: 'email', label: 'Correo electrónico' }, { key: 'dni', label: 'DNI' }, { key: 'telefono', label: 'Teléfono' }, { key: 'addresses', label: 'Direcciones' }] },
  { id: 'addresses', title: 'Direcciones', singular: 'dirección', description: 'Gestiona direcciones de clientes y sus zonas de reparto.', icon: MapPin, create: true, edit: true, remove: true, columns: [{ key: 'alias', label: 'Alias' }, { key: 'clienteNombre', label: 'Cliente' }, { key: 'linea1', label: 'Dirección' }, { key: 'zona', label: 'Zona' }, { key: 'esPrincipal', label: 'Principal' }] },
  { id: 'users', title: 'Administradores', singular: 'administrador', description: 'Administra cuentas del equipo con acceso al panel.', icon: UserRound, create: true, edit: true, remove: true, columns: [{ key: 'avatarUrl', label: 'Avatar' }, { key: 'nombreCompleto', label: 'Administrador' }, { key: 'email', label: 'Correo electrónico' }, { key: 'nivelAcceso', label: 'Nivel de acceso' }, { key: 'ultimoAcceso', label: 'Último acceso' }] },
  { id: 'delivery', title: 'Zonas de reparto', singular: 'zona', description: 'Configura distritos, tarifas y tiempos estimados.', icon: MapPin, create: true, edit: true, remove: true, columns: [{ key: 'nombreDistrito', label: 'Distrito' }, { key: 'costoEnvio', label: 'Costo de envío' }, { key: 'tiempoEstimadoMinutos', label: 'Tiempo (min)' }, { key: 'estado', label: 'Estado' }] },
]

const paths: Record<SectionId, string> = {
  products: dashboardPaths.products,
  offers: dashboardPaths.offers,
  categories: dashboardPaths.categories,
  flavors: dashboardPaths.flavors,
  inventory: dashboardPaths.products,
  'stock-history': dashboardPaths.stockMovements,
  orders: dashboardPaths.orders,
  customers: dashboardPaths.customers,
  addresses: dashboardPaths.addresses,
  users: dashboardPaths.admins,
  delivery: dashboardPaths.zones,
}

const navGroups: { label: string; items: { id: SectionId | 'overview'; label: string; icon: LucideIcon }[] }[] = [
  { label: 'GENERAL', items: [{ id: 'overview', label: 'Resumen', icon: LayoutDashboard }] },
  { label: 'VENTAS', items: [{ id: 'orders', label: 'Pedidos', icon: ShoppingBag }, { id: 'customers', label: 'Clientes', icon: UsersRound }, { id: 'addresses', label: 'Direcciones', icon: MapPin }] },
  { label: 'CATÁLOGO', items: [{ id: 'products', label: 'Productos', icon: Package }, { id: 'offers', label: 'Ofertas', icon: Tags }, { id: 'categories', label: 'Categorías', icon: Tags }, { id: 'flavors', label: 'Sabores', icon: Activity }] },
  { label: 'INVENTARIO', items: [{ id: 'inventory', label: 'Stock actual', icon: Package }, { id: 'stock-history', label: 'Historial de stock', icon: History }] },
  { label: 'REPARTO', items: [{ id: 'delivery', label: 'Zonas de reparto', icon: MapPin }] },
  { label: 'ADMINISTRACIÓN', items: [{ id: 'users', label: 'Administradores', icon: UserRound }] },
]

const asText = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Activo' : 'Inactivo'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const currencyFormatter = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
const compactCurrencyFormatter = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', notation: 'compact', maximumFractionDigits: 1 })

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const orderStates = [
  { value: 'PREPARANDO', label: 'Preparando', color: '#f0ad42' },
  { value: 'EN_CAMINO', label: 'En camino', color: '#5d91bd' },
  { value: 'ENTREGADO', label: 'Entregado', color: '#7eaa65' },
  { value: 'CANCELADO', label: 'Cancelado', color: '#db7762' },
]

const fullName = (value: { nombres?: string; apellidos?: string }) => [value.nombres, value.apellidos].filter(Boolean).join(' ')

function validAvatarUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function initials(value: unknown): string {
  const name = typeof value === 'string' ? value.trim() : ''
  const letters = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('')
  return letters.toUpperCase() || 'U'
}

function isValidHexColor(value: string): boolean {
  return /^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(value.trim())
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.trim().replace('#', '')
  const normalizedHex = hex.length === 3 ? hex.split('').map((digit) => digit + digit).join('') : hex
  const channels = [0, 2, 4].map((index) => parseInt(normalizedHex.slice(index, index + 2), 16) / 255)
  const [red, green, blue] = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ))
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.179 ? '#33261c' : '#ffffff'
}

function normalizeRows(sectionId: SectionId, rows: DashboardEntity[], addresses: Address[]): DashboardEntity[] {
  if (sectionId === 'customers') {
    return (rows as Customer[]).map((customer) => ({
      ...customer,
      nombreCompleto: fullName(customer) || customer.email,
      addresses: addresses.filter((address) => address.clienteId === customer.id).length,
    }))
  }
  if (sectionId === 'users') return (rows as Administrator[]).map((admin) => ({ ...admin, nombreCompleto: fullName(admin) || admin.email }))
  return rows
}

function withId<T extends DashboardEntity>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()]
}

function safeFailureMessage(error: unknown, fallback: string): string {
  return error instanceof DashboardApiError ? error.message : fallback
}

async function loadSection(sectionId: SectionId): Promise<DashboardEntity[]> {
  switch (sectionId) {
    case 'categories': {
      const [active, inactive] = await Promise.all([
        getList<Category>(`${dashboardPaths.categories}/estado/true`),
        getList<Category>(`${dashboardPaths.categories}/estado/false`),
      ])
      return withId([...active, ...inactive])
    }
    case 'flavors': {
      const [active, inactive] = await Promise.all([
        getList<Flavor>(dashboardPaths.flavors),
        getList<Flavor>(`${dashboardPaths.flavors}/disponibilidad/false`),
      ])
      return withId([...active, ...inactive])
    }
    case 'delivery': {
      const [active, inactive] = await Promise.all([
        getList<DeliveryZone>(`${dashboardPaths.zones}/disponibilidad/true`),
        getList<DeliveryZone>(`${dashboardPaths.zones}/disponibilidad/false`),
      ])
      return withId([...active, ...inactive])
    }
    default: return getList(paths[sectionId])
  }
}

function fieldsFor(sectionId: SectionId, entity?: DashboardEntity, options?: { categories: Category[]; flavors: Flavor[]; customers: Customer[]; zones: DeliveryZone[]; products: Product[]; offers: Offer[] }): Field[] {
  const choices = options ?? { categories: [], flavors: [], customers: [], zones: [], products: [], offers: [] }
  switch (sectionId) {
    case 'products':
      return [
        { key: 'sku', label: 'SKU', required: true }, { key: 'nombre', label: 'Nombre', required: true },
        { key: 'descripcion', label: 'Descripción', type: 'textarea' }, { key: 'precioBase', label: 'Precio final (IGV incluido)', type: 'number', step: '0.01', required: true },
        { key: 'maxSabores', label: 'Máximo de sabores', type: 'number', required: true }, { key: 'stockDisponible', label: 'Stock disponible', type: 'number', required: true },
        { key: 'categoriaId', label: 'Categoría', type: 'select', required: true, options: choices.categories.map((row) => ({ value: String(row.id), label: row.nombre })) },
        { key: 'saboresIds', label: 'Sabores', type: 'multiselect', options: choices.flavors.map((row) => ({ value: String(row.id), label: row.nombre, colorHex: row.colorHex })) },
        { key: 'ofertasIds', label: 'Ofertas asociadas', type: 'multiselect', hint: 'Las ofertas se aplican dentro de su vigencia; no pueden coincidir en fechas para un mismo producto.', options: choices.offers.map((row) => ({ value: String(row.id), label: `${row.nombre} (${row.porcentaje}% · ${row.fechaInicio}–${row.fechaFin})` })) },
        { key: 'urlImagen', label: 'URL de imagen', type: 'url', required: true }, { key: 'pesoVolumen', label: 'Peso / volumen', required: true },
        { key: 'tipoPresentacion', label: 'Tipo de presentación', type: 'select', required: true, options: ['CONO', 'PALETA', 'VASO', 'COPA', 'LITRO', 'BARRA'].map((value) => ({ value, label: value })) },
      ]
    case 'offers':
      return [
        { key: 'nombre', label: 'Nombre de la oferta', required: true },
        { key: 'porcentaje', label: 'Descuento (%)', type: 'number', step: '0.01', min: '0.01', max: '100', required: true },
        { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
        { key: 'fechaFin', label: 'Fecha de fin', type: 'date', required: true },
        { key: 'productoIds', label: 'Productos incluidos', type: 'multiselect', required: true, hint: 'Las fechas son inclusivas. No se permiten ofertas superpuestas para el mismo producto.', options: choices.products.map((row) => ({ value: String(row.id), label: `${row.nombre} (${row.sku})` })) },
      ]
    case 'categories': return [{ key: 'nombre', label: 'Nombre', required: true }, { key: 'estado', label: 'Activa', type: 'checkbox' }]
    case 'flavors': return [{ key: 'nombre', label: 'Nombre', required: true }, { key: 'colorHex', label: 'Color', type: 'color', required: true }, { key: 'estadoDisponibilidad', label: 'Disponible', type: 'checkbox' }]
    case 'delivery': return [{ key: 'nombreDistrito', label: 'Distrito', required: true }, { key: 'costoEnvio', label: 'Costo de envío', type: 'number', step: '0.01', required: true }, { key: 'tiempoEstimadoMinutos', label: 'Tiempo estimado (minutos)', type: 'number', required: true }, { key: 'estado', label: 'Activa', type: 'checkbox' }]
    case 'customers': return [
      { key: 'nombres', label: 'Nombres', required: true }, { key: 'apellidos', label: 'Apellidos', required: true },
      { key: 'email', label: 'Correo electrónico', type: 'email', required: true }, { key: 'dni', label: 'DNI', required: true },
      { key: 'telefono', label: 'Teléfono', required: true }, { key: 'avatarUrl', label: 'URL del avatar', type: 'url' },
      { key: 'password', label: entity ? 'Nueva contraseña (opcional)' : 'Contraseña (opcional)', type: 'password' },
    ]
    case 'users': return [
      { key: 'nombres', label: 'Nombres', required: true }, { key: 'apellidos', label: 'Apellidos', required: true },
      { key: 'email', label: 'Correo electrónico', type: 'email', required: true }, { key: 'avatarUrl', label: 'URL del avatar', type: 'url' },
      { key: 'nivelAcceso', label: 'Nivel de acceso', type: 'select', required: true, options: ['SUPERADMIN', 'EDITOR', 'ALMACEN'].map((value) => ({ value, label: value })) },
      { key: 'password', label: entity ? 'Nueva contraseña (opcional)' : 'Contraseña (opcional)', type: 'password' },
    ]
    case 'addresses': return [
      { key: 'clienteId', label: 'Cliente', type: 'select', required: true, disabled: Boolean(entity), options: choices.customers.map((row) => ({ value: String(row.id), label: `${fullName(row)} — ${row.email}` })) },
      { key: 'zonaId', label: 'Zona de reparto', type: 'select', required: true, options: choices.zones.map((row) => ({ value: String(row.id), label: row.nombreDistrito })) },
      { key: 'alias', label: 'Alias', required: true }, { key: 'linea1', label: 'Dirección', required: true },
      { key: 'linea2', label: 'Complemento' }, { key: 'referencia', label: 'Referencia', type: 'textarea' },
      { key: 'esPrincipal', label: 'Dirección principal', type: 'checkbox' },
    ]
    case 'stock-history': return [
      { key: 'productoId', label: 'Producto', type: 'select', required: true, options: choices.products.map((row) => ({ value: String(row.id), label: `${row.nombre} (${row.sku})` })) },
      { key: 'tipoMovimiento', label: 'Tipo de movimiento', type: 'select', required: true, options: ['INGRESO', 'MERMA', 'AJUSTE'].map((value) => ({ value, label: value })) },
      { key: 'cantidadAlterada', label: 'Cantidad', type: 'number', required: true },
      { key: 'observacion', label: 'Observación', type: 'textarea' },
    ]
    default: return []
  }
}

function initialValues(sectionId: SectionId, entity: DashboardEntity | undefined, fields: Field[]): FormValues {
  const values: FormValues = {}
  fields.forEach(({ key, type }) => {
    const raw = entity?.[key]
    if (type === 'checkbox') values[key] = typeof raw === 'boolean' ? raw : key === 'estado' || key === 'estadoDisponibilidad' ? true : false
    else if (type === 'multiselect') {
      const ids = key === 'saboresIds' ? (entity as Product | undefined)?.saboresIds ?? []
        : key === 'ofertasIds' ? (entity as Product | undefined)?.ofertasIds ?? []
          : key === 'productoIds' ? (entity as Offer | undefined)?.productosIds ?? [] : []
      values[key] = ids.map(String)
    } else if (type === 'color') values[key] = raw === null || raw === undefined || raw === '' ? '#e9a324' : String(raw)
    else values[key] = raw === null || raw === undefined ? '' : String(raw)
  })
  if (sectionId === 'products' && entity) {
    const product = entity as Product
    if (product.categoriaId !== undefined) values.categoriaId = String(product.categoriaId)
    if (product.saboresIds) values.saboresIds = product.saboresIds.map(String)
  }
  if (sectionId === 'addresses' && entity) {
    const address = entity as Address
    values.clienteId = String(address.clienteId)
    values.zonaId = String(address.zonaId)
  }
  return values
}

function DashboardModal({ title, fields, values, onChange, onClose, onSubmit, saving, error }: {
  title: string
  fields: Field[]
  values: FormValues
  onChange: (key: string, value: FormValue) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  saving: boolean
  error: string
}) {
  const [multiSearch, setMultiSearch] = useState<Record<string, string>>({})
  const [previewFailedUrl, setPreviewFailedUrl] = useState('')
  const [selectionError, setSelectionError] = useState('')

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    const missingSelection = fields.find((field) => {
      if (field.type !== 'multiselect' || !field.required) return false
      const selectedValues = values[field.key]
      return !Array.isArray(selectedValues) || selectedValues.length === 0
    })
    if (missingSelection) {
      event.preventDefault()
      setSelectionError(`Selecciona al menos una opción en «${missingSelection.label}».`)
      return
    }
    setSelectionError('')
    onSubmit(event)
  }

  return (
    <div className="dashboard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title">
        <header><div><span className="dashboard-eyebrow">GESTIÓN DEL DASHBOARD</span><h2 id="dashboard-modal-title">{title}</h2></div><button type="button" className="dashboard-modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></header>
        <form onSubmit={handleFormSubmit}>
          <div className="dashboard-modal-fields">
            {fields.map((field) => {
              const value = values[field.key]
              if (field.type === 'checkbox') return <label className="dashboard-form-checkbox" key={field.key}><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.key, event.target.checked)} />{field.label}</label>
              if (field.type === 'color') {
                const colorValue = typeof value === 'string' ? value : ''
                const validColor = isValidHexColor(colorValue)
                return <label className="dashboard-form-field dashboard-form-field--wide" key={field.key}>{field.label}
                  <div className="dashboard-color-input-row">
                    <input className="dashboard-color-hex" type="text" required={field.required} pattern="#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})" maxLength={7} placeholder="#e9a324" value={colorValue} onChange={(event) => onChange(field.key, event.target.value)} />
                    <span className={`dashboard-color-preview${validColor ? '' : ' is-invalid'}`} style={validColor ? { backgroundColor: colorValue } : undefined} aria-label={validColor ? `Vista previa del color ${colorValue}` : 'Introduce un hexadecimal válido'} />
                  </div>
                  <small>Escribe un hexadecimal (#RRGGBB) o usa el selector; la muestra se actualiza al instante.</small>
                </label>
              }
              if (field.key === 'urlImagen') {
                const imageUrl = typeof value === 'string' ? value.trim() : ''
                const previewUrl = validAvatarUrl(imageUrl)
                return <label className="dashboard-form-field dashboard-form-field--wide" key={field.key}>{field.label}
                  <input type="url" required={field.required} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(field.key, event.target.value)} />
                  {previewUrl && previewFailedUrl !== previewUrl
                    ? <img className="dashboard-image-preview" src={previewUrl} alt="Vista previa del producto" onError={() => setPreviewFailedUrl(previewUrl)} />
                    : previewUrl
                      ? <small role="status">No se pudo cargar la imagen desde esta URL.</small>
                      : <small>Ingresa una URL de imagen válida para ver la vista previa.</small>}
                </label>
              }
              if (field.type === 'textarea') return <label className="dashboard-form-field dashboard-form-field--wide" key={field.key}>{field.label}<textarea required={field.required} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(field.key, event.target.value)} /></label>
              if (field.type === 'select') return <label className="dashboard-form-field" key={field.key}>{field.label}<select required={field.required} disabled={field.disabled} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(field.key, event.target.value)}><option value="">Selecciona…</option>{field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
              if (field.type === 'multiselect') {
                const selectedValues = Array.isArray(value) ? value : []
                const normalizedSearch = (multiSearch[field.key] ?? '').trim().toLocaleLowerCase()
                const filteredOptions = (field.options ?? []).filter((option) => option.label.toLocaleLowerCase().includes(normalizedSearch))
                return <div className="dashboard-form-field dashboard-form-field--wide dashboard-multiselect" key={field.key}>
                  <span>{field.label}</span>
                  <div className="dashboard-multiselect-toolbar">
                    <input
                      type="search"
                      aria-label={`Buscar ${field.label.toLocaleLowerCase()}`}
                      placeholder={`Buscar ${field.label.toLocaleLowerCase()}...`}
                      value={multiSearch[field.key] ?? ''}
                      onChange={(event) => setMultiSearch((current) => ({ ...current, [field.key]: event.target.value }))}
                    />
                    <span aria-live="polite">{selectedValues.length} seleccionados</span>
                    {selectedValues.length > 0 && <button type="button" className="dashboard-multiselect-clear" onClick={() => { onChange(field.key, []); setSelectionError('') }}>Quitar selección</button>}
                  </div>
                  <div className="dashboard-multiselect-options" role="group" aria-label={field.label}>
                    {filteredOptions.map((option) => {
                      const selected = selectedValues.includes(option.value)
                      const flavorColor = option.colorHex && isValidHexColor(option.colorHex) ? option.colorHex : undefined
                      const selectedStyle = selected && flavorColor
                        ? { backgroundColor: flavorColor, borderColor: '#000000', color: getContrastColor(flavorColor) }
                        : undefined
                      return <button
                        type="button"
                        key={option.value}
                        className={`dashboard-multiselect-option${selected ? ' is-selected' : ''}`}
                        aria-pressed={selected}
                        style={selectedStyle}
                        onClick={() => {
                          onChange(field.key, selected
                            ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
                            : [...selectedValues, option.value])
                          setSelectionError('')
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={selectedStyle ? { backgroundColor: selectedStyle.color, color: flavorColor } : undefined}
                        >{selected ? '✓' : '+'}</span>{option.label}
                      </button>
                    })}
                    {filteredOptions.length === 0 && <small className="dashboard-multiselect-empty">No se encontraron opciones.</small>}
                  </div>
                  {field.hint && <small>{field.hint}</small>}
                </div>
              }
              return <label className="dashboard-form-field" key={field.key}>{field.label}<input type={field.type ?? 'text'} required={field.required} step={field.step} min={field.min} max={field.max} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(field.key, event.target.value)} /></label>
            })}
          </div>
          {(selectionError || error) && <p className="dashboard-form-error" role="alert">{selectionError || error}</p>}
          <footer><button type="button" className="dashboard-secondary-button" onClick={onClose} disabled={saving}>Cancelar</button><button type="submit" className="dashboard-primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button></footer>
        </form>
      </section>
    </div>
  )
}

interface OrderLineForm {
  key: number
  productoId: string
  cantidad: string
  saboresIds: string[]
}

function OrderCreateModal({ customers, addresses, products, flavors, saving, error, onClose, onSubmit }: {
  customers: Customer[]
  addresses: Address[]
  products: Product[]
  flavors: Flavor[]
  saving: boolean
  error: string
  onClose: () => void
  onSubmit: (payload: { clienteId: number; direccionId: number; detalles: { productoId: number; cantidad: number; saboresIds?: number[] }[] }) => void
}) {
  const [clienteId, setClienteId] = useState(String(customers[0]?.id ?? ''))
  const customerAddresses = addresses.filter((address) => address.clienteId === Number(clienteId))
  const [direccionId, setDireccionId] = useState(String(customerAddresses[0]?.id ?? ''))
  const [lines, setLines] = useState<OrderLineForm[]>([{ key: 1, productoId: '', cantidad: '1', saboresIds: [] }])
  const [flavorSearch, setFlavorSearch] = useState<Record<number, string>>({})
  const [validationError, setValidationError] = useState('')

  function changeCustomer(value: string) {
    setClienteId(value)
    const firstAddress = addresses.find((address) => address.clienteId === Number(value))
    setDireccionId(String(firstAddress?.id ?? ''))
  }

  function updateLine(key: number, patch: Partial<OrderLineForm>) {
    setLines((current) => current.map((line) => line.key === key ? { ...line, ...patch } : line))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError('')
    const detalles = lines.map((line) => ({
      productoId: Number(line.productoId),
      cantidad: Number(line.cantidad),
      ...(line.saboresIds.length ? { saboresIds: line.saboresIds.map(Number) } : {}),
    }))
    const invalidLine = lines.some((line) => {
      const product = products.find((item) => item.id === Number(line.productoId))
      return !product || !Number.isInteger(Number(line.cantidad)) || Number(line.cantidad) < 1 ||
        line.saboresIds.length > (product.maxSabores ?? 0)
    })
    if (!clienteId || !direccionId || !customerAddresses.some((address) => address.id === Number(direccionId))) {
      setValidationError('Selecciona un cliente y una de sus direcciones.')
      return
    }
    if (!lines.length || invalidLine) {
      setValidationError('Revisa los productos, las cantidades y la cantidad máxima de sabores permitida.')
      return
    }
    onSubmit({ clienteId: Number(clienteId), direccionId: Number(direccionId), detalles })
  }

  return <div className="dashboard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="dashboard-modal dashboard-order-modal" role="dialog" aria-modal="true" aria-labelledby="create-order-title">
      <header><div><span className="dashboard-eyebrow">VENTAS</span><h2 id="create-order-title">Nuevo pedido</h2></div><button type="button" className="dashboard-modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></header>
      <form onSubmit={submit}>
        <div className="dashboard-modal-fields">
          <label className="dashboard-form-field">Cliente<select required value={clienteId} onChange={(event) => changeCustomer(event.target.value)}><option value="">Selecciona…</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{fullName(customer) || customer.email}</option>)}</select></label>
          <label className="dashboard-form-field">Dirección de entrega<select required value={direccionId} onChange={(event) => setDireccionId(event.target.value)}><option value="">Selecciona…</option>{customerAddresses.map((address) => <option key={address.id} value={address.id}>{address.alias} — {address.linea1}</option>)}</select></label>
        </div>
        <div className="dashboard-order-lines-heading"><strong>Productos del pedido</strong><button type="button" className="dashboard-secondary-button" onClick={() => setLines((current) => [...current, { key: Math.max(0, ...current.map((line) => line.key)) + 1, productoId: '', cantidad: '1', saboresIds: [] }])}>+ Agregar producto</button></div>
        <div className="dashboard-order-lines">
          {lines.map((line, index) => {
            const product = products.find((item) => item.id === Number(line.productoId))
            const productFlavorIds = product?.saboresIds
            const availableFlavors = !product ? [] : productFlavorIds
              ? flavors.filter((flavor) => productFlavorIds.includes(flavor.id))
              : flavors
            const normalizedFlavorSearch = (flavorSearch[line.key] ?? '').trim().toLocaleLowerCase()
            const filteredFlavors = availableFlavors.filter((flavor) => flavor.nombre.toLocaleLowerCase().includes(normalizedFlavorSearch))
            const flavorLimit = product?.maxSabores ?? 0
            return <fieldset className="dashboard-order-line" key={line.key}>
              <legend>Producto {index + 1}</legend>
              <label className="dashboard-form-field">Producto<select required value={line.productoId} onChange={(event) => { updateLine(line.key, { productoId: event.target.value, saboresIds: [] }); setFlavorSearch((current) => ({ ...current, [line.key]: '' })) }}><option value="">Selecciona…</option>{products.map((item) => <option key={item.id} value={item.id}>{item.nombre} — {item.sku}</option>)}</select></label>
              <label className="dashboard-form-field">Cantidad<input type="number" min="1" step="1" required value={line.cantidad} onChange={(event) => updateLine(line.key, { cantidad: event.target.value })} /></label>
              <div className="dashboard-form-field dashboard-form-field--wide dashboard-multiselect">
                <span>Sabores (máx. {flavorLimit})</span>
                <div className="dashboard-multiselect-toolbar">
                  <input
                    type="search"
                    aria-label={`Buscar sabores del producto ${index + 1}`}
                    placeholder="Buscar sabores..."
                    value={flavorSearch[line.key] ?? ''}
                    disabled={!availableFlavors.length}
                    onChange={(event) => setFlavorSearch((current) => ({ ...current, [line.key]: event.target.value }))}
                  />
                  <span aria-live="polite">{line.saboresIds.length} / {flavorLimit} seleccionados</span>
                  {line.saboresIds.length > 0 && <button type="button" className="dashboard-multiselect-clear" onClick={() => updateLine(line.key, { saboresIds: [] })}>Quitar selección</button>}
                </div>
                <div className="dashboard-multiselect-options" role="group" aria-label={`Sabores del producto ${index + 1}`}>
                  {filteredFlavors.map((flavor) => {
                    const flavorId = String(flavor.id)
                    const selected = line.saboresIds.includes(flavorId)
                    const flavorColor = isValidHexColor(flavor.colorHex) ? flavor.colorHex : undefined
                    const selectedStyle = selected && flavorColor
                      ? { backgroundColor: flavorColor, borderColor: '#000000', color: getContrastColor(flavorColor) }
                      : undefined
                    const limitReached = !selected && line.saboresIds.length >= flavorLimit
                    return <button
                      type="button"
                      key={flavor.id}
                      className={`dashboard-multiselect-option${selected ? ' is-selected' : ''}`}
                      aria-pressed={selected}
                      disabled={limitReached}
                      style={selectedStyle}
                      onClick={() => updateLine(line.key, {
                        saboresIds: selected
                          ? line.saboresIds.filter((id) => id !== flavorId)
                          : [...line.saboresIds, flavorId],
                      })}
                    >
                      <span
                        aria-hidden="true"
                        style={selectedStyle ? { backgroundColor: selectedStyle.color, color: flavorColor } : undefined}
                      >{selected ? '✓' : '+'}</span>{flavor.nombre}
                    </button>
                  })}
                  {!filteredFlavors.length && <small className="dashboard-multiselect-empty">
                    {!product ? 'Selecciona un producto para ver sus sabores.' : availableFlavors.length ? 'No se encontraron sabores.' : 'Este producto no tiene sabores disponibles.'}
                  </small>}
                </div>
                {line.saboresIds.length >= flavorLimit && flavorLimit > 0 && <small>Alcanzaste el máximo de sabores para este producto.</small>}
              </div>
              {lines.length > 1 && <button type="button" className="dashboard-remove-line" onClick={() => setLines((current) => current.filter((entry) => entry.key !== line.key))}>Quitar producto</button>}
            </fieldset>
          })}
        </div>
        {(validationError || error) && <p className="dashboard-form-error" role="alert">{validationError || error}</p>}
        <footer><button type="button" className="dashboard-secondary-button" onClick={onClose} disabled={saving}>Cancelar</button><button type="submit" className="dashboard-primary-button" disabled={saving}>{saving ? 'Creando…' : 'Crear pedido'}</button></footer>
      </form>
    </section>
  </div>
}

function OrderManagementModal({ order, saving, error, onClose, onSubmit }: {
  order: Order
  saving: boolean
  error: string
  onClose: () => void
  onSubmit: (paymentStatus: string, shippingStatus: string) => void
}) {
  const payment = order.estadoPago
  const shipping = order.estadoPedido
  const paymentTransitions = payment === 'PENDIENTE' ? ['PAGADO', 'FALLIDO'] : payment === 'PAGADO' ? ['REEMBOLSADO'] : []
  const shippingTransitions = shipping === 'PREPARANDO' ? ['EN_CAMINO', 'CANCELADO'] : shipping === 'EN_CAMINO' ? ['ENTREGADO', 'CANCELADO'] : []
  const [paymentStatus, setPaymentStatus] = useState(payment)
  const [shippingStatus, setShippingStatus] = useState(shipping)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(paymentStatus, shippingStatus)
  }

  return <div className="dashboard-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="manage-order-title">
      <header><div><span className="dashboard-eyebrow">PEDIDO #{order.id}</span><h2 id="manage-order-title">Actualizar estados</h2></div><button type="button" className="dashboard-modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></header>
      <form onSubmit={submit}><div className="dashboard-modal-fields">
        <label className="dashboard-form-field">Estado de envío<select value={shippingStatus} disabled={!shippingTransitions.length} onChange={(event) => setShippingStatus(event.target.value)}><option value={shipping}>{shipping}</option>{shippingTransitions.map((state) => <option key={state} value={state}>{state}</option>)}</select><small>{shippingTransitions.length ? 'Solo se muestran transiciones permitidas.' : 'No hay más cambios de envío disponibles.'}</small></label>
        <label className="dashboard-form-field">Estado de pago<select value={paymentStatus} disabled={!paymentTransitions.length} onChange={(event) => setPaymentStatus(event.target.value)}><option value={payment}>{payment}</option>{paymentTransitions.map((state) => <option key={state} value={state}>{state}</option>)}</select><small>{paymentTransitions.length ? 'Solo se muestran transiciones permitidas.' : 'No hay más cambios de pago disponibles.'}</small></label>
      </div>
      {error && <p className="dashboard-form-error" role="alert">{error}</p>}
      <footer><button type="button" className="dashboard-secondary-button" onClick={onClose} disabled={saving}>Cancelar</button><button type="submit" className="dashboard-primary-button" disabled={saving || (paymentStatus === payment && shippingStatus === shipping)}>{saving ? 'Guardando…' : 'Guardar estados'}</button></footer></form>
    </section>
  </div>
}

function DashboardDialog({ dialog, onClose, onConfirm }: {
  dialog: DashboardDialogState
  onClose: () => void
  onConfirm: () => void
}) {
  const isConfirm = dialog.kind === 'confirm'
  const isError = dialog.kind === 'error'
  const Icon = isConfirm ? AlertTriangle : isError ? AlertTriangle : CheckCircle2
  return (
    <div className="dashboard-modal-backdrop dashboard-notice-backdrop" role="presentation">
      <section className="dashboard-modal dashboard-notice-modal" role={isConfirm ? 'alertdialog' : 'dialog'} aria-modal="true" aria-labelledby="dashboard-notice-title">
        <div className={`dashboard-notice-icon dashboard-notice-icon--${dialog.kind}`}><Icon size={25} /></div>
        <h2 id="dashboard-notice-title">{dialog.title}</h2>
        <p>{dialog.message}</p>
        <footer>
          {isConfirm && <button type="button" className="dashboard-secondary-button" onClick={onClose}>Cancelar</button>}
          <button type="button" className={`dashboard-primary-button${isError ? ' dashboard-danger-button' : ''}`} onClick={isConfirm ? onConfirm : onClose} autoFocus>
            {isConfirm ? dialog.confirmLabel ?? 'Confirmar' : 'Entendido'}
          </button>
        </footer>
      </section>
    </div>
  )
}

function Overview({ products, orders, customers, loading, onGo }: {
  products: Product[]
  orders: Order[]
  customers: Customer[]
  loading: boolean
  onGo: (id: SectionId) => void
}) {
  const metrics = useMemo(() => {
    const now = new Date()
    const saleOrders = orders.filter((order) => order.estadoPago === 'PAGADO' && order.estadoPedido !== 'CANCELADO')
    const monthlySales = saleOrders.filter((order) => {
      const createdAt = new Date(order.createdAt)
      return !Number.isNaN(createdAt.getTime())
        && createdAt.getFullYear() === now.getFullYear()
        && createdAt.getMonth() === now.getMonth()
    })
    const salesThisMonth = monthlySales.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const averageTicket = monthlySales.length ? salesThisMonth / monthlySales.length : 0
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    const salesByDay = new Map<string, number>()
    saleOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt)
      const key = Number.isNaN(createdAt.getTime()) ? '' : localDateKey(createdAt)
      if (key >= localDateKey(startDate) && key <= localDateKey(now)) {
        salesByDay.set(key, (salesByDay.get(key) ?? 0) + Number(order.total || 0))
      }
    })
    const salesDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      return {
        key: localDateKey(date),
        label: date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', ''),
        total: salesByDay.get(localDateKey(date)) ?? 0,
      }
    })
    const orderStatusCounts = orderStates.map((status) => ({
      ...status,
      count: orders.filter((order) => order.estadoPedido === status.value).length,
    }))
    const productsBySales = new Map<number, { name: string; units: number; sales: number }>()
    saleOrders.forEach((order) => {
      order.detalles?.forEach((detail) => {
        const product = productsBySales.get(detail.productoId) ?? { name: detail.producto, units: 0, sales: 0 }
        product.units += Number(detail.cantidad || 0)
        product.sales += Number(detail.subtotal || 0)
        productsBySales.set(detail.productoId, product)
      })
    })
    const lowStock = products
      .filter((product) => product.stockDisponible <= 10)
      .sort((left, right) => left.stockDisponible - right.stockDisponible || left.nombre.localeCompare(right.nombre))
    const recentOrders = [...orders].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()).slice(0, 5)
    return {
      salesThisMonth,
      averageTicket,
      ordersInProgress: orders.filter((order) => order.estadoPedido === 'PREPARANDO' || order.estadoPedido === 'EN_CAMINO').length,
      salesDays,
      orderStatusCounts,
      orderCount: orders.length,
      topProducts: [...productsBySales.values()].sort((left, right) => right.units - left.units).slice(0, 5),
      lowStock,
      recentOrders,
    }
  }, [orders, products])
  const maxDailySales = Math.max(...metrics.salesDays.map((day) => day.total), 0)
  const totalOrdersByStatus = metrics.orderStatusCounts.reduce((sum, status) => sum + status.count, 0)
  let chartEnd = 0
  const statusGradient = totalOrdersByStatus
    ? metrics.orderStatusCounts.map((status) => {
      const start = chartEnd
      chartEnd += status.count / totalOrdersByStatus * 100
      return `${status.color} ${start}% ${chartEnd}%`
    }).join(', ')
    : '#f0ece5 0% 100%'
  const maxProductUnits = Math.max(...metrics.topProducts.map((product) => product.units), 1)

  return <>
    <div className="dashboard-page-heading"><div><span className="dashboard-eyebrow">ADMINISTRACIÓN</span><h1>¡Hola, administrador!</h1><p>Indicadores clave para supervisar ventas, pedidos e inventario.</p></div></div>
    <section className="dashboard-stats" aria-label="Resumen del negocio">
      {[
        { label: 'Ventas pagadas del mes', value: formatCurrency(metrics.salesThisMonth), note: 'Pedidos del mes no cancelados', icon: DollarSign, tone: 'green' },
        { label: 'Ticket promedio', value: formatCurrency(metrics.averageTicket), note: 'Por pedido pagado este mes', icon: Activity, tone: 'blue' },
        { label: 'Pedidos en proceso', value: metrics.ordersInProgress.toLocaleString('es-PE'), note: 'Preparando o en camino', icon: ShoppingBag, tone: 'orange' },
        { label: 'Clientes registrados', value: customers.length.toLocaleString('es-PE'), note: 'Cuentas activas', icon: UsersRound, tone: 'pink' },
        { label: 'Productos por reponer', value: metrics.lowStock.length.toLocaleString('es-PE'), note: 'Stock de 10 unidades o menos', icon: AlertTriangle, tone: 'orange' },
      ].map(({ label, value, note, icon: CardIcon, tone }) => (
        <article className="dashboard-stat-card" key={label}>
          <div className={`dashboard-stat-icon dashboard-stat-icon--${tone}`}><CardIcon size={20} /></div>
          <span>{label}</span><strong>{loading ? '—' : value}</strong><small className="dashboard-stat-caption">{note}</small>
        </article>
      ))}
    </section>
    <div className="dashboard-overview-grid dashboard-overview-grid--primary">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Ventas de los últimos 7 días</h2><p>Pedidos pagados, agrupados por fecha de creación.</p></div><span className="dashboard-overview-period">7 días</span></div>
        {loading ? <p className="dashboard-empty" role="status">Cargando indicadores…</p> : (
          <>
            <div className="dashboard-sales-chart" role="img" aria-label="Ventas pagadas de los últimos siete días">
              {metrics.salesDays.map((day) => {
                const height = maxDailySales ? Math.max(day.total ? 7 : 2, day.total / maxDailySales * 100) : 2
                return <div className="dashboard-sales-day" key={day.key} title={`${day.label}: ${formatCurrency(day.total)}`}>
                  <span>{day.total ? compactCurrencyFormatter.format(day.total) : ''}</span>
                  <div className="dashboard-sales-track"><i className="dashboard-sales-bar" style={{ height: `${height}%` }} /></div>
                  <small>{day.label}</small>
                </div>
              })}
            </div>
            <div className="dashboard-chart-legend"><span />Total del periodo<strong>{formatCurrency(metrics.salesDays.reduce((sum, day) => sum + day.total, 0))}</strong></div>
          </>
        )}
      </section>
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Estado de pedidos</h2><p>{metrics.orderCount.toLocaleString('es-PE')} pedidos registrados</p></div></div>
        {loading ? <p className="dashboard-empty" role="status">Cargando indicadores…</p> : (
          <div className="dashboard-status-chart">
            <div className="dashboard-status-donut" style={{ background: `conic-gradient(${statusGradient})` }} role="img" aria-label="Distribución de pedidos por estado">
              <div><strong>{totalOrdersByStatus.toLocaleString('es-PE')}</strong><span>pedidos</span></div>
            </div>
            <div className="dashboard-status-legend">
              {metrics.orderStatusCounts.map((status) => <div key={status.value}>
                <span><i style={{ backgroundColor: status.color }} />{status.label}</span><strong>{status.count.toLocaleString('es-PE')}</strong>
              </div>)}
            </div>
          </div>
        )}
      </section>
    </div>
    <div className="dashboard-overview-grid dashboard-overview-grid--secondary">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Productos más vendidos</h2><p>Unidades en pedidos pagados no cancelados.</p></div></div>
        {loading ? <p className="dashboard-empty" role="status">Cargando indicadores…</p> : metrics.topProducts.length ? (
          <div className="dashboard-ranking-list">
            {metrics.topProducts.map((product, index) => <div className="dashboard-ranking-item" key={product.name}>
              <span className="dashboard-ranking-position">{String(index + 1).padStart(2, '0')}</span>
              <div className="dashboard-ranking-details"><div><strong>{product.name}</strong><small>{product.units} unidades · {formatCurrency(product.sales)}</small></div>
                <div className="dashboard-ranking-track"><i style={{ width: `${product.units / maxProductUnits * 100}%` }} /></div>
              </div>
            </div>)}
          </div>
        ) : <p className="dashboard-empty">Aún no hay ventas pagadas para mostrar.</p>}
      </section>
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Alertas de inventario</h2><p>{metrics.lowStock.length} productos requieren atención.</p></div><button type="button" className="dashboard-overview-link" onClick={() => onGo('inventory')}>Ver inventario →</button></div>
        {loading ? <p className="dashboard-empty" role="status">Cargando indicadores…</p> : metrics.lowStock.length ? (
          <div className="dashboard-stock-list">{metrics.lowStock.slice(0, 5).map((product) => <div key={product.id}>
            <span className={`dashboard-stock-dot${product.stockDisponible === 0 ? ' dashboard-stock-dot--empty' : ' dashboard-stock-dot--low'}`} />
            <span><strong>{product.nombre}</strong><small>{product.stockDisponible === 0 ? 'Sin existencias' : `Quedan ${product.stockDisponible} unidades`}</small></span>
            <span className={`dashboard-stock-pill${product.stockDisponible === 0 ? ' is-empty' : ''}`}>{product.stockDisponible === 0 ? 'Agotado' : 'Stock bajo'}</span>
          </div>)}</div>
        ) : <p className="dashboard-empty">No hay productos con poco stock.</p>}
      </section>
    </div>
    <section className="dashboard-panel dashboard-recent-panel">
      <div className="dashboard-panel-heading"><div><h2>Pedidos recientes</h2><p>Últimos 5 pedidos registrados.</p></div><button type="button" className="dashboard-overview-link" onClick={() => onGo('orders')}>Ver pedidos →</button></div>
      {loading ? <p className="dashboard-empty" role="status">Cargando pedidos…</p> : metrics.recentOrders.length ? (
        <div className="dashboard-table-scroll"><table className="dashboard-table dashboard-recent-table">
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Pago</th><th>Entrega</th></tr></thead>
          <tbody>{metrics.recentOrders.map((order) => <tr key={order.id}>
            <td><span className="dashboard-table-primary">#{order.id}</span></td>
            <td>{order.clienteNombre}</td>
            <td>{new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</td>
            <td>{formatCurrency(Number(order.total || 0))}</td>
            <td><span className={`dashboard-status dashboard-status--${order.estadoPago.toLocaleLowerCase()}`}>{order.estadoPago}</span></td>
            <td><span className={`dashboard-status dashboard-status--${order.estadoPedido.toLocaleLowerCase().replace(/_/g, '-')}`}>{order.estadoPedido.replace(/_/g, ' ')}</span></td>
          </tr>)}</tbody>
        </table></div>
      ) : <p className="dashboard-empty">Todavía no hay pedidos registrados.</p>}
    </section>
  </>
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sectionParam = searchParams.get('section')
  const activeSection = sections.find((section) => section.id === sectionParam)?.id ?? 'overview'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [data, setData] = useState<DashboardEntity[]>([])
  const refreshRequestId = useRef(0)
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [modalEntity, setModalEntity] = useState<DashboardEntity | undefined>()
  const [modalOpen, setModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [dialog, setDialog] = useState<DashboardDialogState | null>(null)
  const [orderModal, setOrderModal] = useState<'create' | 'manage' | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderSaving, setOrderSaving] = useState(false)
  const [orderError, setOrderError] = useState('')
  const logoutMutation = useMutation({
    mutationFn: cerrarSesion,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      setDialog({
        kind: 'error',
        title: 'No se pudo cerrar la sesión',
        message: error instanceof AuthApiError
          ? error.message
          : 'Ocurrió un problema. Inténtalo nuevamente más tarde.',
      })
    },
  })

  const selectedSection = useMemo(() => sections.find((section) => section.id === activeSection), [activeSection])

  const loadAuxiliaryData = useCallback(async () => {
    const [productRows, categoryRows, flavorRows, customerRows, addressRows, zoneRows, orderRows] = await Promise.all([
      getList<Product>(dashboardPaths.products),
      loadSection('categories') as Promise<Category[]>,
      loadSection('flavors') as Promise<Flavor[]>,
      getList<Customer>(dashboardPaths.customers),
      getList<Address>(dashboardPaths.addresses),
      loadSection('delivery') as Promise<DeliveryZone[]>,
      getList<Order>(dashboardPaths.orders),
    ])
    return { productRows, categoryRows, flavorRows, customerRows, addressRows, zoneRows, orderRows }
  }, [])

  const refresh = useCallback(async (requestId?: number) => {
    const currentRequestId = requestId ?? ++refreshRequestId.current
    if (activeSection === 'overview') {
      setLoading(true)
      setLoadError('')
      try {
        const auxiliaryData = await loadAuxiliaryData()
        if (currentRequestId !== refreshRequestId.current) return
        setProducts(auxiliaryData.productRows)
        setCategories(auxiliaryData.categoryRows)
        setFlavors(auxiliaryData.flavorRows)
        setCustomers(auxiliaryData.customerRows)
        setAddresses(auxiliaryData.addressRows)
        setZones(auxiliaryData.zoneRows)
        setOrders(auxiliaryData.orderRows)
      } catch (error) {
        if (currentRequestId !== refreshRequestId.current) return
        setLoadError('No se pudieron cargar los datos. Inténtalo nuevamente.')
        setDialog({ kind: 'error', title: 'No se pudieron cargar los datos', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
      } finally {
        if (currentRequestId === refreshRequestId.current) setLoading(false)
      }
      return
    }
    setLoading(true)
    setLoadError('')
    try {
      const rows = await loadSection(activeSection)
      if (currentRequestId !== refreshRequestId.current) return
      setData(rows)
      if (activeSection === 'products' || activeSection === 'inventory') setProducts(rows as Product[])
      if (activeSection === 'categories') setCategories(rows as Category[])
      if (activeSection === 'flavors') setFlavors(rows as Flavor[])
      if (activeSection === 'customers') setCustomers(rows as Customer[])
      if (activeSection === 'addresses') setAddresses(rows as Address[])
      if (activeSection === 'delivery') setZones(rows as DeliveryZone[])
      if (activeSection === 'orders') setOrders(rows as Order[])
      if (activeSection === 'offers') setOffers(rows as Offer[])
    } catch (error) {
      if (currentRequestId !== refreshRequestId.current) return
      setLoadError('No se pudieron cargar los datos. Inténtalo nuevamente.')
      setDialog({ kind: 'error', title: 'No se pudieron cargar los datos', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
      setData([])
    } finally {
      if (currentRequestId === refreshRequestId.current) setLoading(false)
    }
  }, [activeSection, loadAuxiliaryData])

  useEffect(() => {
    const requestId = ++refreshRequestId.current
    const timer = window.setTimeout(() => { void refresh(requestId) }, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  function selectSection(id: SectionId | 'overview') {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (id === 'overview') next.delete('section')
      else next.set('section', id)
      return next
    }, { replace: true })
    setQuery('')
    setDialog(null)
    setSidebarOpen(false)
  }

  function confirmDialogAction() {
    const action = dialog?.onConfirm
    setDialog(null)
    action?.()
  }

  const displayRows = useMemo(() => {
    if (!selectedSection) return []
    let rows = activeSection === 'orders' ? orders : activeSection === 'customers' ? data : data
    if (activeSection === 'customers') rows = normalizeRows('customers', data, addresses)
    if (activeSection === 'users') rows = normalizeRows('users', data, addresses)
    if (!query.trim()) return rows
    const normalizedQuery = query.toLocaleLowerCase()
    return rows.filter((row) => Object.values(row).some((value) => asText(value).toLocaleLowerCase().includes(normalizedQuery)))
  }, [activeSection, addresses, data, orders, query, selectedSection])

  async function openEditor(entity?: DashboardEntity) {
    if (!selectedSection || !selectedSection.create && !entity) return
    setFormError('')
    setDialog(null)
    let current = entity
    try {
      if (entity && activeSection === 'products') current = await getOne<Product>(`${dashboardPaths.products}/${entity.id}`)
      let editorCategories = categories
      let editorFlavors = flavors
      let editorOffers = offers
      let editorProducts = products
      if (activeSection === 'products') {
        const [categoryRows, flavorRows, offerRows] = await Promise.all([
          loadSection('categories') as Promise<Category[]>,
          loadSection('flavors') as Promise<Flavor[]>,
          getList<Offer>(dashboardPaths.offers),
        ])
        editorCategories = categoryRows
        editorFlavors = flavorRows
        editorOffers = offerRows
        setCategories(categoryRows)
        setFlavors(flavorRows)
        setOffers(offerRows)
      }
      if (activeSection === 'offers') {
        editorProducts = await getList<Product>(dashboardPaths.products)
        setProducts(editorProducts)
      }
      const fields = fieldsFor(activeSection as SectionId, current, {
        categories: editorCategories, flavors: editorFlavors, customers, zones, products: editorProducts, offers: editorOffers,
      })
      setModalEntity(current)
      setFormValues(initialValues(activeSection as SectionId, current, fields))
      setModalOpen(true)
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo abrir el registro', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
    }
  }

  function makePayload(sectionId: SectionId, values: FormValues): Record<string, unknown> {
    const payload: Record<string, unknown> = { ...values }
    for (const key of ['precioBase', 'maxSabores', 'stockDisponible', 'categoriaId', 'costoEnvio', 'tiempoEstimadoMinutos', 'clienteId', 'zonaId', 'productoId', 'cantidadAlterada']) {
      if (typeof payload[key] === 'string' && payload[key] !== '') payload[key] = Number(payload[key])
    }
    for (const key of ['saboresIds', 'ofertasIds', 'productoIds']) {
      if (Array.isArray(payload[key])) payload[key] = (payload[key] as string[]).map(Number)
    }
    if (typeof payload.porcentaje === 'string') payload.porcentaje = Number(payload.porcentaje)
    if (payload.password === '') delete payload.password
    if (sectionId === 'products') return payload
    if (sectionId === 'addresses') {
      delete payload.clienteId
      return payload
    }
    if (sectionId === 'stock-history') return payload
    return payload
  }

  async function persistSave() {
    if (!selectedSection) return
    setSaving(true)
    setFormError('')
    try {
      const payload = makePayload(activeSection as SectionId, formValues)
      const isMovement = activeSection === 'stock-history'
      const path = isMovement ? dashboardPaths.stockMovements
        : activeSection === 'addresses' && !modalEntity ? `${dashboardPaths.addresses}/cliente/${formValues.clienteId}`
          : `${paths[activeSection as SectionId]}${modalEntity ? `/${modalEntity.id}` : ''}`
      const method = isMovement || !modalEntity ? 'POST' : 'PUT'
      await mutate(path, method, payload)
      setModalOpen(false)
      await refresh()
      setDialog({
        kind: 'success',
        title: modalEntity ? 'Cambios guardados' : 'Registro creado',
        message: modalEntity ? 'Los cambios se guardaron correctamente.' : 'El registro se creó correctamente.',
      })
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo guardar', message: safeFailureMessage(error, 'No se pudieron guardar los cambios. Inténtalo nuevamente.') })
    } finally { setSaving(false) }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSection) return
    if (activeSection === 'offers' && String(formValues.fechaFin) < String(formValues.fechaInicio)) {
      setFormError('La fecha de fin debe ser igual o posterior a la fecha de inicio.')
      return
    }
    setFormError('')
    setDialog({
      kind: 'confirm',
      title: modalEntity ? 'Confirmar cambios' : 'Confirmar creación',
      message: modalEntity ? '¿Deseas guardar los cambios de este registro?' : '¿Deseas crear este registro con los datos ingresados?',
      confirmLabel: modalEntity ? 'Guardar cambios' : 'Crear registro',
      onConfirm: () => { void persistSave() },
    })
  }

  async function persistRemove(entity: DashboardEntity) {
    try {
      await mutate(`${paths[activeSection as SectionId]}/${entity.id}`, 'DELETE')
      await refresh()
      setDialog({ kind: 'success', title: 'Registro eliminado', message: 'La acción se completó correctamente.' })
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo eliminar', message: safeFailureMessage(error, 'No se pudo completar la acción. Inténtalo nuevamente.') })
    }
  }

  function remove(entity: DashboardEntity) {
    if (!selectedSection?.remove) return
    setDialog({
      kind: 'confirm',
      title: `Eliminar ${selectedSection.singular}`,
      message: '¿Confirmas esta acción? El registro dejará de estar disponible.',
      confirmLabel: 'Eliminar',
      onConfirm: () => { void persistRemove(entity) },
    })
  }

  async function addCustomerAddress(customer: DashboardEntity) {
    selectSection('addresses')
    setTimeout(() => {
      const addressFields = fieldsFor('addresses', undefined, { categories, flavors, customers, zones, products, offers })
      setModalEntity(undefined)
      setFormValues({ ...initialValues('addresses', undefined, addressFields), clienteId: String(customer.id) })
      setFormError('')
      setModalOpen(true)
    }, 0)
  }

  async function openOrderCreate() {
    setOrderError('')
    setOrderSaving(true)
    try {
      const [customerRows, addressRows, productRows, flavorRows, inactiveFlavorRows] = await Promise.all([
        getList<Customer>(dashboardPaths.customers),
        getList<Address>(dashboardPaths.addresses),
        getList<Product>(dashboardPaths.products),
        getList<Flavor>(dashboardPaths.flavors),
        getList<Flavor>(`${dashboardPaths.flavors}/disponibilidad/false`),
      ])
      setCustomers(customerRows)
      setAddresses(addressRows)
      setProducts(productRows)
      setFlavors(withId([...flavorRows, ...inactiveFlavorRows]))
      setOrderModal('create')
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudieron cargar las opciones', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
    } finally { setOrderSaving(false) }
  }

  async function persistCreateOrder(payload: { clienteId: number; direccionId: number; detalles: { productoId: number; cantidad: number; saboresIds?: number[] }[] }) {
    setOrderSaving(true)
    setOrderError('')
    try {
      await mutate(dashboardPaths.orders, 'POST', payload)
      setOrderModal(null)
      await refresh()
      setDialog({ kind: 'success', title: 'Pedido creado', message: 'El pedido se creó correctamente.' })
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo crear el pedido', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
    } finally { setOrderSaving(false) }
  }

  function createOrder(payload: { clienteId: number; direccionId: number; detalles: { productoId: number; cantidad: number; saboresIds?: number[] }[] }) {
    setDialog({
      kind: 'confirm',
      title: 'Confirmar pedido',
      message: '¿Deseas crear este pedido? Se reservará el stock de los productos.',
      confirmLabel: 'Crear pedido',
      onConfirm: () => { void persistCreateOrder(payload) },
    })
  }

  function openOrderManager(order: Order) {
    setSelectedOrder(order)
    setOrderError('')
    setOrderModal('manage')
  }

  async function persistOrderStatuses(paymentStatus: string, shippingStatus: string) {
    if (!selectedOrder) return
    setOrderSaving(true)
    setOrderError('')
    try {
      const currentShipping = selectedOrder.estadoPedido
      if (paymentStatus !== selectedOrder.estadoPago) {
        await mutate(`${dashboardPaths.orders}/${selectedOrder.id}/pago/${encodeURIComponent(paymentStatus)}`, 'PUT')
      }
      if (shippingStatus !== currentShipping) {
        await mutate(`${dashboardPaths.orders}/${selectedOrder.id}/estado/${encodeURIComponent(shippingStatus)}`, 'PUT')
      }
      setOrderModal(null)
      setSelectedOrder(null)
      await refresh()
      setDialog({ kind: 'success', title: 'Pedido actualizado', message: 'Los estados del pedido se actualizaron correctamente.' })
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo actualizar el pedido', message: safeFailureMessage(error, 'Inténtalo nuevamente más tarde.') })
    } finally { setOrderSaving(false) }
  }

  function updateOrderStatuses(paymentStatus: string, shippingStatus: string) {
    setDialog({
      kind: 'confirm',
      title: 'Confirmar actualización',
      message: '¿Deseas aplicar los cambios de pago y envío seleccionados?',
      confirmLabel: 'Actualizar pedido',
      onConfirm: () => { void persistOrderStatuses(paymentStatus, shippingStatus) },
    })
  }

  async function persistRemoveOrder(order: Order) {
    try {
      await mutate(`${dashboardPaths.orders}/${order.id}`, 'DELETE')
      await refresh()
      setDialog({ kind: 'success', title: 'Pedido eliminado', message: 'El pedido se eliminó correctamente.' })
    } catch (error) {
      setDialog({ kind: 'error', title: 'No se pudo eliminar el pedido', message: safeFailureMessage(error, 'No se pudo completar la acción. Inténtalo nuevamente.') })
    }
  }

  function removeOrder(order: Order) {
    const shipping = order.estadoPedido
    if (shipping !== 'PREPARANDO' || order.estadoPago !== 'PENDIENTE') return
    setDialog({
      kind: 'confirm',
      title: `Eliminar pedido #${order.id}`,
      message: 'Solo se pueden eliminar pedidos pendientes sin pago y en preparación. ¿Confirmas la eliminación?',
      confirmLabel: 'Eliminar pedido',
      onConfirm: () => { void persistRemoveOrder(order) },
    })
  }

  const tableRows = displayRows
  const formFields = selectedSection ? fieldsFor(activeSection as SectionId, modalEntity, { categories, flavors, customers, zones, products, offers }) : []
  const stockSummary = useMemo(() => {
    if (activeSection !== 'stock-history') return null
    const movements = data as StockMovement[]
    const sumByType = (type: StockMovement['tipoMovimiento']) => movements
      .filter((movement) => movement.tipoMovimiento === type)
      .reduce((sum, movement) => sum + Math.abs(Number(movement.cantidadAlterada || 0)), 0)
    return {
      count: movements.length,
      income: sumByType('INGRESO'),
      sold: sumByType('VENTA'),
      waste: sumByType('MERMA'),
      netChange: movements.reduce((sum, movement) => sum + Number(movement.cantidadAlterada || 0), 0),
    }
  }, [activeSection, data])

  return <div className="dashboard-shell">
    <aside className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}>
      <div className="dashboard-brand"><Link to="/inicio" aria-label="Cremissimo, ir a la tienda"><img src={logoCremissimo} alt="Cremissimo" /></Link><span>ADMINISTRACIÓN</span></div>
      <nav className="dashboard-nav" aria-label="Navegación de administración">
        {navGroups.map((group) => <div className="dashboard-nav-group" key={group.label}><span className="dashboard-nav-label">{group.label}</span>
          {group.items.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={`dashboard-nav-item${activeSection === id ? ' is-active' : ''}`} onClick={() => selectSection(id)} aria-current={activeSection === id ? 'page' : undefined}><Icon size={19} strokeWidth={1.8} /><span>{label}</span></button>)}
        </div>)}
      </nav>
      <div className="dashboard-sidebar-bottom"><div className="dashboard-profile"><div className="dashboard-avatar">AD</div><span><strong>Administración</strong><small>Administrador</small></span><ChevronDown size={16} /></div><button type="button" className="dashboard-logout" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}><LogOut size={17} /> {logoutMutation.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}</button></div>
    </aside>
    {sidebarOpen && <button className="dashboard-backdrop" type="button" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} />}
    <main className="dashboard-main">
      <header className="dashboard-topbar"><button type="button" className="dashboard-menu-toggle" aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <div className="dashboard-breadcrumb"><span>Administración</span><span>/</span><strong>{selectedSection?.title ?? 'Resumen'}</strong></div>
        <div className="dashboard-topbar-actions"><span className="dashboard-live-status"><i /> Conectado</span><button type="button" className="dashboard-notification" aria-label="Notificaciones"><Bell size={19} /></button><Link to="/inicio" className="dashboard-topbar-store"><ShoppingBag size={16} /> Ir a la tienda</Link></div>
      </header>
      <div className="dashboard-content">
        {selectedSection ? <>
          <div className="dashboard-page-heading dashboard-list-heading"><div><span className="dashboard-eyebrow">GESTIÓN DE {selectedSection.title.toUpperCase()}</span><h1>{selectedSection.title}</h1><p>{selectedSection.description}</p></div>
            {(selectedSection.create || activeSection === 'inventory') && <button type="button" className="dashboard-primary-button" onClick={() => { if (activeSection === 'inventory') selectSection('stock-history'); else if (activeSection === 'orders') void openOrderCreate(); else void openEditor() }} disabled={activeSection === 'orders' && orderSaving}><Plus size={18} /> {activeSection === 'inventory' ? 'Registrar movimiento' : activeSection === 'stock-history' ? 'Nuevo movimiento' : `Nuevo ${selectedSection.singular}`}</button>}
          </div>
          {stockSummary && <section className="dashboard-stock-summary" aria-label="Resumen de cambios de stock">
            <div className="dashboard-stock-summary-heading"><strong>Resumen de movimientos</strong><span>{loading ? 'Actualizando historial…' : `${stockSummary.count.toLocaleString('es-PE')} ${stockSummary.count === 1 ? 'registro' : 'registros'} del historial`}</span></div>
            <div className="dashboard-stock-summary-grid">
              <article className="dashboard-stock-summary-item dashboard-stock-summary-item--income"><span>Entradas</span><strong>{loading ? '—' : `+${stockSummary.income.toLocaleString('es-PE')}`}</strong><small>unidades ingresadas</small></article>
              <article className="dashboard-stock-summary-item dashboard-stock-summary-item--sales"><span>Ventas</span><strong>{loading ? '—' : `-${stockSummary.sold.toLocaleString('es-PE')}`}</strong><small>unidades despachadas</small></article>
              <article className="dashboard-stock-summary-item dashboard-stock-summary-item--waste"><span>Mermas</span><strong>{loading ? '—' : `-${stockSummary.waste.toLocaleString('es-PE')}`}</strong><small>unidades dadas de baja</small></article>
              <article className="dashboard-stock-summary-item dashboard-stock-summary-item--net"><span>Cambio neto</span><strong>{loading ? '—' : `${stockSummary.netChange > 0 ? '+' : ''}${stockSummary.netChange.toLocaleString('es-PE')}`}</strong><small>balance de todos los movimientos</small></article>
            </div>
          </section>}
          <section className="dashboard-panel dashboard-data-panel">
            <div className="dashboard-list-toolbar"><div><strong>{loading ? 'Cargando…' : `${tableRows.length} ${tableRows.length === 1 ? selectedSection.singular : selectedSection.title.toLocaleLowerCase()}`}</strong><span>{selectedSection.readOnly ? 'Historial de solo lectura; los movimientos no se editan ni eliminan.' : 'Datos obtenidos del servicio'}</span></div><label className="dashboard-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar ${selectedSection.title.toLowerCase()}...`} aria-label={`Buscar ${selectedSection.title.toLowerCase()}`} /></label></div>
            {loadError && <div className="dashboard-inline-error" role="alert">{loadError}<button type="button" onClick={() => void refresh()}>Reintentar</button></div>}
            <div className="dashboard-table-scroll"><table className="dashboard-table"><thead><tr>{selectedSection.columns.map((column) => <th key={column.key}>{column.label}</th>)}{(selectedSection.edit || selectedSection.remove || activeSection === 'customers' || activeSection === 'orders') && <th>Acciones</th>}</tr></thead>
              <tbody>
                {loading && <tr><td className="dashboard-empty" colSpan={selectedSection.columns.length + 1} role="status">Cargando datos…</td></tr>}
                {!loading && !loadError && tableRows.map((row) => <tr key={row.id}>
                  {selectedSection.columns.map((column) => {
                    let value = row[column.key]
                    if (activeSection === 'orders' && column.key === 'estadoPedido') value = (row as Order).estadoPedido
                    if (column.key === 'precioBase' || column.key === 'costoEnvio') value = value === undefined ? value : `S/ ${Number(value).toFixed(2)}`
                    if (column.key === 'createdAt' || column.key === 'fechaMovimiento' || column.key === 'ultimoAcceso') value = value ? new Date(String(value)).toLocaleString('es-PE') : value
                    if (activeSection === 'offers' && (column.key === 'fechaInicio' || column.key === 'fechaFin')) value = value ? new Date(`${String(value)}T00:00:00`).toLocaleDateString('es-PE') : value
                    if (activeSection === 'offers' && column.key === 'porcentaje') value = value === undefined ? value : `${Number(value)}%`
                    if (activeSection === 'products' && column.key === 'precioBase') {
                      const product = row as Product
                      if (product.porcentajeDescuento != null && product.precioFinal != null) {
                        return <td key={column.key}><span className="dashboard-product-price"><s>S/ {Number(product.precioBase).toFixed(2)}</s><strong>S/ {Number(product.precioFinal).toFixed(2)}</strong><small>-{product.porcentajeDescuento}%</small></span></td>
                      }
                    }
                    if (activeSection === 'orders' && (column.key === 'estadoPago' || column.key === 'estadoPedido')) return <td key={column.key}><span className="dashboard-status">{asText(value)}</span></td>
                    if (activeSection === 'offers' && column.key === 'estado') {
                      const stateClass = value === 'VIGENTE' ? 'dashboard-status--vigente' : value === 'PROGRAMADA' ? 'dashboard-status--programada' : 'dashboard-status--finalizada'
                      const stateLabel = value === 'VIGENTE' ? 'Vigente' : value === 'PROGRAMADA' ? 'Programada' : 'Finalizada'
                      return <td key={column.key}><span className={`dashboard-status ${stateClass}`}>{stateLabel}</span></td>
                    }
                    if (column.key === 'colorHex') return <td key={column.key}><span className="dashboard-color-cell"><i className="dashboard-color-swatch" style={{ backgroundColor: asText(value) }} />{asText(value)}</span></td>
                    if (column.key === 'avatarUrl') {
                      const avatarUrl = validAvatarUrl(value)
                      const displayName = row.nombreCompleto ?? row.email
                      return <td key={column.key}><span className="dashboard-table-avatar">{avatarUrl ? <img src={avatarUrl} alt={`Avatar de ${asText(displayName)}`} loading="lazy" referrerPolicy="no-referrer" /> : initials(displayName)}</span></td>
                    }
                    if (column.key === 'estado' || column.key === 'estadoDisponibilidad' || column.key === 'esPrincipal') return <td key={column.key}><span className={`dashboard-status${value ? '' : ' dashboard-status--agotado'}`}>{value ? (column.key === 'esPrincipal' ? 'Sí' : 'Activo') : 'Inactivo'}</span></td>
                    return <td key={column.key}><span className={column.key === 'nombre' || column.key === 'id' ? 'dashboard-table-primary' : undefined}>{asText(value)}</span></td>
                  })}
                  {(selectedSection.edit || selectedSection.remove || activeSection === 'customers' || activeSection === 'orders') && <td className="dashboard-row-actions">
                    {selectedSection.edit && <button type="button" aria-label={`Editar ${selectedSection.singular}`} title={`Editar ${selectedSection.singular}`} onClick={() => void openEditor(row)}><Pencil size={16} /></button>}
                    {selectedSection.remove && <button type="button" aria-label={`Eliminar ${selectedSection.singular}`} title={`Eliminar ${selectedSection.singular}`} onClick={() => void remove(row)}><Trash2 size={16} /></button>}
                    {activeSection === 'customers' && <button type="button" className="dashboard-address-action" onClick={() => void addCustomerAddress(row)} title="Agregar dirección">+ Dirección</button>}
                    {activeSection === 'orders' && <><button type="button" aria-label={`Actualizar pedido ${row.id}`} title="Actualizar estados de envío y pago" onClick={() => openOrderManager(row as Order)}><Pencil size={16} /></button>{(row as Order).estadoPedido === 'PREPARANDO' && (row as Order).estadoPago === 'PENDIENTE' && <button type="button" aria-label={`Eliminar pedido ${row.id}`} title="Eliminar pedido pendiente" onClick={() => void removeOrder(row as Order)}><Trash2 size={16} /></button>}</>}
                  </td>}
                </tr>)}
                {!loading && !loadError && tableRows.length === 0 && <tr><td className="dashboard-empty" colSpan={selectedSection.columns.length + 1}>{query ? `No hay resultados para “${query}”.` : `No hay ${selectedSection.title.toLowerCase()} para mostrar.`}</td></tr>}
              </tbody>
            </table></div>
            <div className="dashboard-table-footer"><span>Mostrando {tableRows.length} registros</span><span>La búsqueda filtra todos los registros cargados</span></div>
          </section>
          {activeSection === 'inventory' && <p className="dashboard-placeholder-note"><Clock3 size={15} />Para ajustar stock, edita el producto o registra un movimiento en el historial.</p>}
        </> : <Overview products={products} orders={orders} customers={customers} loading={loading} onGo={selectSection} />}
        <footer className="dashboard-footer">© 2026 Cremissimo <span>Hecho con <b>♥</b> y mucho helado</span></footer>
      </div>
    </main>
    {modalOpen && selectedSection && <DashboardModal title={`${modalEntity ? 'Editar' : 'Nuevo'} ${selectedSection.singular}`} fields={formFields} values={formValues} saving={saving} error={formError} onClose={() => setModalOpen(false)} onSubmit={save} onChange={(key, value) => setFormValues((current) => ({ ...current, [key]: value }))} />}
    {orderModal === 'create' && <OrderCreateModal customers={customers} addresses={addresses} products={products} flavors={flavors} saving={orderSaving} error={orderError} onClose={() => setOrderModal(null)} onSubmit={(payload) => void createOrder(payload)} />}
    {orderModal === 'manage' && selectedOrder && <OrderManagementModal order={selectedOrder} saving={orderSaving} error={orderError} onClose={() => { setOrderModal(null); setSelectedOrder(null) }} onSubmit={(payment, shipping) => void updateOrderStatuses(payment, shipping)} />}
    {dialog && <DashboardDialog dialog={dialog} onClose={() => setDialog(null)} onConfirm={confirmDialogAction} />}
  </div>
}
