import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
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
import './checkout.css'

interface DeliveryZone {
  district: string
  cost: number
  eta: string
}

interface CheckoutAddress {
  id: number
  alias: string
  district: string
  line1: string
  line2: string
  reference: string
  isPrimary: boolean
}

type PaymentBrand = 'Visa' | 'Mastercard'

interface PaymentMethod {
  id: number
  brand: PaymentBrand
  holder: string
  lastFour: string
}

export interface PurchaseConfirmationData {
  orderNumber: string
}

interface AddressDraft {
  alias: string
  district: string
  line1: string
  line2: string
  reference: string
  isPrimary: boolean
}

const deliveryZones: DeliveryZone[] = [
  { district: 'Miraflores', cost: 8, eta: '30–45 min' },
  { district: 'San Isidro', cost: 8, eta: '30–45 min' },
  { district: 'Barranco', cost: 10, eta: '40–55 min' },
  { district: 'Surco', cost: 12, eta: '45–60 min' },
]

const initialAddresses: CheckoutAddress[] = [
  { id: 1, alias: 'Casa', district: 'Miraflores', line1: 'Av. Larco 1234', line2: 'Dpto. 402', reference: 'Frente al parque', isPrimary: true },
  { id: 2, alias: 'Oficina', district: 'San Isidro', line1: 'Calle Los Pinos 456', line2: 'Piso 5', reference: 'Edificio de fachada azul', isPrimary: false },
]

const initialPaymentMethods: PaymentMethod[] = [
  { id: 1, brand: 'Visa', holder: 'María Ríos', lastFour: '0275' },
  { id: 2, brand: 'Mastercard', holder: 'María Ríos', lastFour: '8842' },
]

const emptyAddressDraft: AddressDraft = {
  alias: '',
  district: deliveryZones[0].district,
  line1: '',
  line2: '',
  reference: '',
  isPrimary: false,
}

function moneda(valor: number) {
  return `S/ ${valor.toFixed(2)}`
}

function generarNumeroPedidoDemo() {
  return `CR-${Date.now().toString().slice(-8)}`
}

export default function CheckoutPage() {
  const { carrito, vaciarCarrito } = useLayout()
  const navigate = useNavigate()
  const lineas = agruparProductos(carrito)
  const subtotal = calcularSubtotal(carrito)
  const [addresses, setAddresses] = useState(initialAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(initialAddresses[0].id)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft)
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods)
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(initialPaymentMethods[0].id)
  const [paymentFormOpen, setPaymentFormOpen] = useState(false)

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null
  const selectedZone = deliveryZones.find((zone) => zone.district === selectedAddress?.district) ?? null
  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedPaymentId) ?? null
  const estimatedTotal = subtotal + (selectedZone?.cost ?? 0)

  function openNewAddress() {
    setEditingAddressId(null)
    setAddressDraft({ ...emptyAddressDraft, isPrimary: addresses.length === 0 })
    setAddressModalOpen(true)
  }

  function openEditAddress(address: CheckoutAddress) {
    setEditingAddressId(address.id)
    setAddressDraft({
      alias: address.alias,
      district: address.district,
      line1: address.line1,
      line2: address.line2,
      reference: address.reference,
      isPrimary: address.isPrimary,
    })
    setAddressModalOpen(true)
  }

  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const address: CheckoutAddress = {
      id: editingAddressId ?? Date.now(),
      alias: String(formData.get('alias')).trim(),
      district: String(formData.get('district')),
      line1: String(formData.get('line1')).trim(),
      line2: String(formData.get('line2')).trim(),
      reference: String(formData.get('reference')).trim(),
      isPrimary: formData.get('isPrimary') === 'on',
    }

    let updatedAddresses = editingAddressId
      ? addresses.map((current) => current.id === editingAddressId ? address : current)
      : [...addresses, address]

    if (address.isPrimary) {
      updatedAddresses = updatedAddresses.map((current) => ({ ...current, isPrimary: current.id === address.id }))
    } else if (!updatedAddresses.some((current) => current.isPrimary)) {
      updatedAddresses = updatedAddresses.map((current, index) => ({ ...current, isPrimary: index === 0 }))
    }

    setAddresses(updatedAddresses)
    setSelectedAddressId(address.id)
    setAddressModalOpen(false)
  }

  function deleteAddress(id: number) {
    const deletedPrimary = addresses.find((address) => address.id === id)?.isPrimary ?? false
    let updatedAddresses = addresses.filter((address) => address.id !== id)

    if (deletedPrimary && updatedAddresses.length > 0) {
      updatedAddresses = updatedAddresses.map((address, index) => ({ ...address, isPrimary: index === 0 }))
    }

    setAddresses(updatedAddresses)
    if (selectedAddressId === id) setSelectedAddressId(updatedAddresses[0]?.id ?? null)
  }

  function selectPrimaryAddress(id: number) {
    setAddresses((current) => current.map((address) => ({ ...address, isPrimary: address.id === id })))
    setSelectedAddressId(id)
  }

  function savePaymentMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const method: PaymentMethod = {
      id: Date.now(),
      brand: formData.get('brand') === 'Mastercard' ? 'Mastercard' : 'Visa',
      holder: String(formData.get('holder')).trim(),
      lastFour: String(formData.get('lastFour')).trim(),
    }
    setPaymentMethods((current) => [...current, method])
    setSelectedPaymentId(method.id)
    setPaymentFormOpen(false)
    event.currentTarget.reset()
  }

  function confirmarCompra() {
    if (!selectedAddress || !selectedZone || !selectedPaymentMethod) return

    const confirmation: PurchaseConfirmationData = {
      orderNumber: generarNumeroPedidoDemo(),
    }

    vaciarCarrito()
    navigate('/compra/confirmacion', { state: confirmation, replace: true })
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
                <button className="checkout-add-button" type="button" onClick={openNewAddress}><Plus size={16} /> Agregar dirección</button>
              </div>

              {addresses.length === 0 ? (
                <div className="checkout-no-address">
                  <p>Aún no tienes direcciones guardadas.</p>
                  <button type="button" onClick={openNewAddress}>Agregar una dirección</button>
                </div>
              ) : (
                <div className="checkout-address-list">
                  {addresses.map((address) => {
                    const zone = deliveryZones.find((item) => item.district === address.district)
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
                              {address.isPrimary && <span className="checkout-primary-badge">Principal</span>}
                              <span className="checkout-address-recipient">María Ríos · +51 900 000 123</span>
                            </span>
                            <span>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</span>
                            <span>{address.district}, Lima, Perú{address.reference ? ` · Ref: ${address.reference}` : ''}</span>
                            {zone && <small><Truck size={13} /> {zone.eta} · Envío {moneda(zone.cost)}</small>}
                          </span>
                        </label>
                        <div className="checkout-address-actions">
                          {!address.isPrimary && (
                            <button type="button" onClick={() => selectPrimaryAddress(address.id)}>Hacer principal</button>
                          )}
                          <button type="button" onClick={() => openEditAddress(address)}>Editar</button>
                          <button className="is-danger" type="button" onClick={() => deleteAddress(address.id)}>Eliminar</button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="checkout-panel checkout-payment-panel" aria-labelledby="checkout-payment-title">
              <div className="checkout-panel-header">
                <div className="checkout-section-icon checkout-section-icon--blue"><CreditCard size={19} /></div>
                <div className="checkout-panel-title">
                  <h2 id="checkout-payment-title">Método de pago</h2>
                  <p>Selecciona un método guardado o agrega uno de prueba.</p>
                </div>
                <button className="checkout-add-button" type="button" onClick={() => setPaymentFormOpen((open) => !open)}>
                  <Plus size={16} /> Agregar método
                </button>
              </div>

              <div className="checkout-payment-list">
                {paymentMethods.map((method) => (
                  <label className={`checkout-payment-option${selectedPaymentId === method.id ? ' is-selected' : ''}`} key={method.id}>
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={selectedPaymentId === method.id}
                      onChange={() => setSelectedPaymentId(method.id)}
                    />
                    <span className="checkout-radio-mark" />
                    <span className={`checkout-card-mark checkout-card-mark--${method.brand.toLowerCase()}`}>{method.brand === 'Visa' ? 'VISA' : 'MC'}</span>
                    <span className="checkout-payment-details">
                      <strong>{method.brand} ···· {method.lastFour}</strong>
                      <small>{method.holder}</small>
                    </span>
                    {selectedPaymentId === method.id && <Check className="checkout-payment-check" size={17} />}
                  </label>
                ))}
              </div>

              {paymentMethods.length === 0 && <p className="checkout-no-address">Agrega un método de pago de demostración para continuar.</p>}

              {paymentFormOpen && (
                <form className="checkout-payment-form" onSubmit={savePaymentMethod}>
                  <div className="checkout-form-heading">
                    <div><strong>Agregar método de demostración</strong><small>No ingreses número completo de tarjeta ni CVV.</small></div>
                    <button type="button" aria-label="Cerrar formulario de método de pago" onClick={() => setPaymentFormOpen(false)}><X size={17} /></button>
                  </div>
                  <div className="checkout-form-grid checkout-payment-fields">
                    <label>Tipo de tarjeta
                      <select name="brand" defaultValue="Visa">
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                      </select>
                    </label>
                    <label>Nombre del titular
                      <input name="holder" autoComplete="cc-name" placeholder="Ej. María Ríos" required />
                    </label>
                    <label>Últimos 4 dígitos
                      <input name="lastFour" inputMode="numeric" autoComplete="off" maxLength={4} pattern="[0-9]{4}" placeholder="0000" required />
                    </label>
                  </div>
                  <button className="checkout-form-submit" type="submit">Guardar método de prueba</button>
                </form>
              )}
              <p className="checkout-demo-note">Los métodos mostrados son de demostración; no se almacenan datos bancarios reales.</p>
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
              <div className="checkout-summary-row"><span>Subtotal</span><strong>{moneda(subtotal)}</strong></div>
              <div className="checkout-promo-placeholder">
                <div><Tag size={15} /><span>Código promocional</span></div>
                <button type="button" disabled title="Los cupones estarán disponibles próximamente">Próximamente</button>
              </div>
              <div className="checkout-summary-row">
                <span>Gastos de envío</span>
                <strong>{selectedZone ? moneda(selectedZone.cost) : 'Selecciona dirección'}</strong>
              </div>
              <div className="checkout-summary-row"><span>Impuestos</span><span className="checkout-summary-pending">Se confirmarán al pagar</span></div>
              <div className="checkout-summary-total">
                <span>Total estimado</span>
                <strong>{moneda(estimatedTotal)}</strong>
              </div>
              <p className="checkout-summary-disclaimer">Estimación de muestra. El cálculo final de impuestos y pago aún no está conectado.</p>
              <button
                type="button"
                className="checkout-place-order"
                disabled={!selectedAddress || !selectedZone || !selectedPaymentMethod}
                onClick={confirmarCompra}
                title="Flujo de demostración; no se realizará ningún cobro"
              >
                Confirmar compra (demo) <ArrowRight size={17} />
              </button>
              <p className="checkout-terms">Al continuar, aceptas los términos y condiciones de Cremissimo.</p>
            </section>

            <section className="checkout-panel checkout-trust-panel">
              <div><ShieldCheck size={19} /><strong>Compra segura</strong></div>
              <p>Tu información se manejará de forma segura cuando se conecte la pasarela de pago.</p>
              <div className="checkout-trust-divider" />
              <div><Truck size={19} /><strong>Entrega refrigerada</strong></div>
              <p>La fecha y el costo de entrega se confirmarán según tu zona.</p>
            </section>

            <Link className="checkout-back-link" to="/carrito"><ArrowLeft size={15} /> Volver al carrito</Link>
          </aside>
        </div>

        <div className="checkout-footer-note"><LockKeyhole size={14} /> Esta vista es una demostración; no se realiza ningún cobro.</div>
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
                  <select name="district" value={addressDraft.district} onChange={(event) => setAddressDraft((current) => ({ ...current, district: event.target.value }))}>
                    {deliveryZones.map((zone) => <option value={zone.district} key={zone.district}>{zone.district} · Envío {moneda(zone.cost)}</option>)}
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
                <button type="button" className="checkout-cancel-button" onClick={() => setAddressModalOpen(false)}>Cancelar</button>
                <button type="submit" className="checkout-form-submit">{editingAddressId ? 'Guardar cambios' : 'Guardar dirección'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
