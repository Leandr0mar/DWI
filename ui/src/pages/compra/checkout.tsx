import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { agruparProductos, calcularSubtotal } from '../../componets/common/carrito_flotante/cart-utils'
import { useLayout } from '../../componets/common/layout/Layout'
import { AuthApiError, obtenerUsuarioActual, type AuthUser } from '../../services/auth'
import {
  CheckoutApiError,
  createCheckoutOrder,
  createMyAddress,
  deleteMyAddress,
  getDeliveryZones,
  getMyAddresses,
  updateMyAddress,
  type CheckoutAddress,
  type CheckoutAddressPayload,
  type CheckoutDeliveryZone,
} from '../../services/checkout-api'
import './checkout.css'

export interface PurchaseConfirmationData {
  orderNumber: string
  total: number
  estadoPago: string
}

interface AddressDraft {
  alias: string
  zonaId: string
  line1: string
  line2: string
  reference: string
  isPrimary: boolean
}

const emptyAddressDraft: AddressDraft = {
  alias: '',
  zonaId: '',
  line1: '',
  line2: '',
  reference: '',
  isPrimary: false,
}

function moneda(valor: number) {
  return `S/ ${valor.toFixed(2)}`
}

export default function CheckoutPage() {
  const { carrito, vaciarCarrito } = useLayout()
  const navigate = useNavigate()
  const lineas = agruparProductos(carrito)
  const subtotal = calcularSubtotal(carrito)
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([])
  const [deliveryZones, setDeliveryZones] = useState<CheckoutDeliveryZone[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft)
  const [usuario, setUsuario] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingAddress, setSavingAddress] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getMyAddresses(), getDeliveryZones(), obtenerUsuarioActual()])
      .then(([addressRows, zoneRows, user]) => {
        if (!active) return
        setAddresses(addressRows)
        setDeliveryZones(zoneRows)
        setUsuario(user)
        setSelectedAddressId(addressRows.find((address) => address.esPrincipal)?.id ?? addressRows[0]?.id ?? null)
      })
      .catch((cause: unknown) => {
        if (!active) return
        if ((cause instanceof CheckoutApiError || cause instanceof AuthApiError) && cause.status === 401) {
          setAuthRequired(true)
          setError('Inicia sesión con tu cuenta de cliente para continuar.')
        } else if (cause instanceof CheckoutApiError && cause.status === 403) {
          setAuthRequired(true)
          setError('El checkout y la gestión de direcciones están disponibles para cuentas de cliente.')
        } else {
          setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las opciones de entrega.')
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null
  const selectedZone = deliveryZones.find((zone) => zone.id === selectedAddress?.zonaId) ?? null
  const igv = Math.round((subtotal * 18 / 118) * 100) / 100
  const estimatedTotal = subtotal + (selectedZone?.costoEnvio ?? 0)

  function openNewAddress() {
    setEditingAddressId(null)
    setAddressDraft({
      ...emptyAddressDraft,
      zonaId: String(deliveryZones[0]?.id ?? ''),
      isPrimary: addresses.length === 0,
    })
    setAddressModalOpen(true)
  }

  function openEditAddress(address: CheckoutAddress) {
    setEditingAddressId(address.id)
    setAddressDraft({
      alias: address.alias,
      zonaId: String(address.zonaId),
      line1: address.linea1,
      line2: address.linea2 ?? '',
      reference: address.referencia ?? '',
      isPrimary: address.esPrincipal,
    })
    setAddressModalOpen(true)
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSavingAddress(true)
    setError('')
    const payload: CheckoutAddressPayload = {
      zonaId: Number(addressDraft.zonaId),
      alias: addressDraft.alias.trim(),
      linea1: addressDraft.line1.trim(),
      linea2: addressDraft.line2.trim(),
      referencia: addressDraft.reference.trim(),
      esPrincipal: addressDraft.isPrimary,
    }
    try {
      const saved = editingAddressId
        ? await updateMyAddress(editingAddressId, payload)
        : await createMyAddress(payload)
      setAddresses((current) => {
        const updated = editingAddressId
          ? current.map((address) => address.id === saved.id ? saved : address)
          : [...current, saved]
        return saved.esPrincipal ? updated.map((address) => ({ ...address, esPrincipal: address.id === saved.id })) : updated
      })
      setSelectedAddressId(saved.id)
      setAddressModalOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la dirección.')
    } finally {
      setSavingAddress(false)
    }
  }

  async function deleteAddress(id: number) {
    if (!window.confirm('¿Deseas eliminar esta dirección de tu cuenta?')) return
    setError('')
    try {
      await deleteMyAddress(id)
      const updated = addresses.filter((address) => address.id !== id)
      setAddresses(updated)
      if (selectedAddressId === id) setSelectedAddressId(updated.find((address) => address.esPrincipal)?.id ?? updated[0]?.id ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo eliminar la dirección.')
    }
  }

  async function selectPrimaryAddress(address: CheckoutAddress) {
    setError('')
    try {
      const saved = await updateMyAddress(address.id, {
        zonaId: address.zonaId,
        alias: address.alias,
        linea1: address.linea1,
        linea2: address.linea2 ?? '',
        referencia: address.referencia ?? '',
        esPrincipal: true,
      })
      setAddresses((current) => current.map((item) => ({ ...item, esPrincipal: item.id === saved.id })))
      setSelectedAddressId(saved.id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo actualizar la dirección principal.')
    }
  }

  async function confirmarCompra() {
    if (!selectedAddress || !carrito.length || savingOrder) return
    setSavingOrder(true)
    setError('')
    try {
      const pedido = await createCheckoutOrder({
        direccionId: selectedAddress.id,
        detalles: lineas.map(({ producto, cantidad }) => ({ productoId: producto.id, cantidad })),
      })
      const confirmation: PurchaseConfirmationData = {
        orderNumber: pedido.id ? String(pedido.id) : pedido.uuid,
        total: Number(pedido.total),
        estadoPago: pedido.estadoPago,
      }
      vaciarCarrito()
      navigate('/compra/confirmacion', { state: confirmation, replace: true })
    } catch (cause) {
      if (cause instanceof CheckoutApiError && cause.status === 401) setAuthRequired(true)
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el pedido.')
    } finally {
      setSavingOrder(false)
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <nav className="checkout-breadcrumb" aria-label="Ruta de navegación">
            <Link to="/inicio">Inicio</Link><span>/</span><Link to="/carrito">Carrito</Link><span>/</span><span>Compra</span>
          </nav>
          <section className="checkout-empty">
            <div className="checkout-empty-icon"><ShoppingBag size={30} /></div>
            <span className="checkout-eyebrow">CASI LISTO</span>
            <h1>Tu carrito está vacío</h1>
            <p>Agrega tus helados favoritos antes de continuar con la compra.</p>
            <Link className="checkout-primary-link" to="/productos">Volver a productos <ArrowRight size={17} /></Link>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <nav className="checkout-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/inicio">Inicio</Link><span>/</span><Link to="/carrito">Carrito</Link><span>/</span><span>Compra</span>
        </nav>
        {error && <div className="checkout-request-error" role="alert">
          <p>{error}</p>
          {authRequired
            ? <Link to="/login" state={{ from: '/checkout' }}>Iniciar sesión</Link>
            : <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Reintentar</button>}
        </div>}

        <header className="checkout-heading">
          <div>
            <span className="checkout-eyebrow">UN PASO MÁS CERCA</span>
            <h1>Finaliza tu compra</h1>
            <p>Confirma la entrega y el método de pago para tus helados.</p>
          </div>
          <div className="checkout-secure-label"><LockKeyhole size={15} /> Compra segura</div>
        </header>

        <div className="checkout-layout">
          <div className="checkout-main-column">
            <section className="checkout-panel checkout-address-panel" aria-labelledby="checkout-address-title">
              <div className="checkout-panel-header">
                <div className="checkout-section-icon"><MapPin size={19} /></div>
                <div className="checkout-panel-title">
                  <h2 id="checkout-address-title">Dirección de entrega</h2>
                  <p>Elige dónde quieres recibir tu pedido.</p>
                </div>
                <button className="checkout-add-button" type="button" onClick={openNewAddress} disabled={loading || authRequired || deliveryZones.length === 0}><Plus size={16} /> Agregar dirección</button>
              </div>

              {loading ? <p className="checkout-no-address">Cargando tus direcciones y zonas de reparto…</p> : addresses.length === 0 ? (
                <div className="checkout-no-address">
                  <p>Aún no tienes direcciones guardadas.</p>
                  {!authRequired && <button type="button" onClick={openNewAddress} disabled={deliveryZones.length === 0}>Agregar una dirección</button>}
                </div>
              ) : (
                <div className="checkout-address-list">
                  {addresses.map((address) => {
                    const zone = deliveryZones.find((item) => item.id === address.zonaId)
                    return (
                      <article className={`checkout-address-option${selectedAddressId === address.id ? ' is-selected' : ''}`} key={address.id}>
                        <label className="checkout-address-choice">
                          <input
                            type="radio"
                            name="delivery-address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                          />
                          <span className="checkout-radio-mark" />
                          <span className="checkout-address-content">
                            <span className="checkout-address-line">
                              <strong>{address.alias}</strong>
                              {address.esPrincipal && <span className="checkout-primary-badge">Principal</span>}
                              <span className="checkout-address-recipient">{usuario?.nombreCompleto}</span>
                            </span>
                            <span>{address.linea1}{address.linea2 ? `, ${address.linea2}` : ''}</span>
                            <span>{address.zona}, Lima, Perú{address.referencia ? ` · Ref: ${address.referencia}` : ''}</span>
                            {zone && <small><Truck size={13} /> {zone.tiempoEstimadoMinutos ? `${zone.tiempoEstimadoMinutos} min` : 'Tiempo por coordinar'} · Envío {moneda(Number(zone.costoEnvio))}</small>}
                          </span>
                        </label>
                        <div className="checkout-address-actions">
                          {!address.esPrincipal && (
                            <button type="button" onClick={() => void selectPrimaryAddress(address)}>Hacer principal</button>
                          )}
                          <button type="button" onClick={() => openEditAddress(address)}>Editar</button>
                          <button className="is-danger" type="button" onClick={() => void deleteAddress(address.id)}>Eliminar</button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="checkout-panel checkout-payment-panel" aria-labelledby="checkout-payment-title">
              <div className="checkout-panel-header">
                <div className="checkout-section-icon checkout-section-icon--blue"><ShieldCheck size={19} /></div>
                <div className="checkout-panel-title">
                  <h2 id="checkout-payment-title">Pago</h2>
                  <p>En esta versión no se procesan pagos en línea.</p>
                </div>
              </div>
              <p className="checkout-demo-note">Al confirmar se guardará el pedido en tu cuenta con pago pendiente. No se solicitarán datos bancarios ni se realizará ningún cobro.</p>
            </section>

            <section className="checkout-panel checkout-products-panel" aria-labelledby="checkout-products-title">
              <div className="checkout-panel-header checkout-products-header">
                <div className="checkout-section-icon checkout-section-icon--orange"><ShoppingBag size={20} /></div>
                <div className="checkout-panel-title">
                  <h2 id="checkout-products-title">Tu pedido</h2>
                  <p>{carrito.length} {carrito.length === 1 ? 'unidad' : 'unidades'} en {lineas.length} {lineas.length === 1 ? 'producto' : 'productos'}</p>
                </div>
                <Link to="/carrito">Editar carrito <ArrowRight size={14} /></Link>
              </div>
              <div className="checkout-product-list">
                {lineas.map(({ producto, cantidad }) => (
                  <article className="checkout-product" key={`${producto.id}-${producto.sabor}`}>
                    <img src={producto.imagen} alt={producto.nombre} />
                    <div className="checkout-product-info">
                      <strong>{producto.nombre}</strong>
                      <span>Sabor: {producto.sabor}</span>
                      <small>Cantidad: {cantidad} · {moneda(producto.precio)} c/u</small>
                    </div>
                    <strong className="checkout-product-total">{moneda(producto.precio * cantidad)}</strong>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="checkout-summary-column">
            <section className="checkout-panel checkout-summary-panel" aria-labelledby="checkout-summary-title">
              <div className="checkout-summary-heading">
                <h2 id="checkout-summary-title">Resumen de compra</h2>
                <span>{lineas.length} {lineas.length === 1 ? 'producto' : 'productos'}</span>
              </div>
              <div className="checkout-summary-row"><span>Subtotal (IGV incluido)</span><strong>{moneda(subtotal)}</strong></div>
              <div className="checkout-promo-placeholder">
                <div><Tag size={15} /><span>Código promocional</span></div>
                <button type="button" disabled title="Los cupones estarán disponibles próximamente">Próximamente</button>
              </div>
              <div className="checkout-summary-row">
                <span>Gastos de envío</span>
                <strong>{selectedZone ? moneda(Number(selectedZone.costoEnvio)) : 'Selecciona dirección'}</strong>
              </div>
              <div className="checkout-summary-row"><span>IGV incluido (18%)</span><strong>{moneda(igv)}</strong></div>
              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>{moneda(estimatedTotal)}</strong>
              </div>
              <p className="checkout-summary-disclaimer">Los precios de los productos incluyen IGV. El total se verifica nuevamente al guardar el pedido.</p>
              <button
                type="button"
                className="checkout-place-order"
                disabled={!selectedAddress || !selectedZone || loading || savingOrder || authRequired}
                onClick={() => void confirmarCompra()}
              >
                {savingOrder ? 'Guardando pedido…' : 'Confirmar pedido'} <ArrowRight size={17} />
              </button>
              <p className="checkout-terms">El pedido se guardará con pago pendiente. No se realizará ningún cobro en línea.</p>
            </section>

            <section className="checkout-panel checkout-trust-panel">
              <div><ShieldCheck size={19} /><strong>Pedido guardado en tu cuenta</strong></div>
              <p>El precio, el stock, los impuestos y el costo de envío son verificados por el servidor.</p>
              <div className="checkout-trust-divider" />
              <div><Truck size={19} /><strong>Entrega refrigerada</strong></div>
              <p>La fecha y el costo de entrega se confirmarán según tu zona.</p>
            </section>

            <Link className="checkout-back-link" to="/carrito"><ArrowLeft size={15} /> Volver al carrito</Link>
          </aside>
        </div>

        <div className="checkout-footer-note"><LockKeyhole size={14} /> No se solicitan datos de tarjeta ni se procesa un pago en esta versión.</div>
      </div>

      {addressModalOpen && (
        <div className="checkout-modal-backdrop" onClick={() => setAddressModalOpen(false)}>
          <section
            className="checkout-address-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-address-form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="checkout-modal-header">
              <div>
                <span className="checkout-eyebrow">DIRECCIONES DE ENTREGA</span>
                <h2 id="checkout-address-form-title">{editingAddressId ? 'Editar dirección' : 'Agregar dirección'}</h2>
              </div>
              <button type="button" aria-label="Cerrar formulario" onClick={() => setAddressModalOpen(false)}><X size={19} /></button>
            </div>
            <form onSubmit={saveAddress}>
              <div className="checkout-form-grid">
                <label>Alias de la dirección
                  <input name="alias" value={addressDraft.alias} onChange={(event) => setAddressDraft((current) => ({ ...current, alias: event.target.value }))} placeholder="Casa, oficina..." required maxLength={50} />
                </label>
                <label>Distrito
                  <select name="zonaId" value={addressDraft.zonaId} onChange={(event) => setAddressDraft((current) => ({ ...current, zonaId: event.target.value }))} required>
                    {deliveryZones.map((zone) => <option value={zone.id} key={zone.id}>{zone.nombreDistrito} · Envío {moneda(Number(zone.costoEnvio))}</option>)}
                  </select>
                </label>
                <label className="checkout-form-full">Dirección
                  <input name="line1" value={addressDraft.line1} onChange={(event) => setAddressDraft((current) => ({ ...current, line1: event.target.value }))} placeholder="Avenida, calle y número" required maxLength={200} />
                </label>
                <label className="checkout-form-full">Departamento, interior u otra indicación <span>(opcional)</span>
                  <input name="line2" value={addressDraft.line2} onChange={(event) => setAddressDraft((current) => ({ ...current, line2: event.target.value }))} placeholder="Dpto. 402, interior..." maxLength={200} />
                </label>
                <label className="checkout-form-full">Referencia <span>(opcional)</span>
                  <textarea name="reference" value={addressDraft.reference} onChange={(event) => setAddressDraft((current) => ({ ...current, reference: event.target.value }))} placeholder="Indicaciones para encontrar la dirección" rows={3} />
                </label>
              </div>
              <label className="checkout-primary-checkbox">
                <input type="checkbox" name="isPrimary" checked={addressDraft.isPrimary} onChange={(event) => setAddressDraft((current) => ({ ...current, isPrimary: event.target.checked }))} />
                Usar como dirección principal
              </label>
              <div className="checkout-modal-actions">
                <button type="button" className="checkout-cancel-button" onClick={() => setAddressModalOpen(false)} disabled={savingAddress}>Cancelar</button>
                <button type="submit" className="checkout-form-submit" disabled={savingAddress}>{savingAddress ? 'Guardando…' : editingAddressId ? 'Guardar cambios' : 'Guardar dirección'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
