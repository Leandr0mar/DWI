import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Clock3,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Tags,
  Trash2,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import logoCremissimo from '../../assets/logo/img_logo3.png'
import imageRainbowCone from '../../assets/productos_destacados/pd_1.jpg'
import imageStrawberry from '../../assets/productos_destacados/pd_2.jpg'
import imageBlueCone from '../../assets/productos_destacados/pd_3.jpg'
import './dashboard.css'

type SectionId = 'overview' | 'products' | 'categories' | 'flavors' | 'orders' | 'customers' | 'delivery' | 'users' | 'inventory' | 'stock-history'
type TableRow = Record<string, string>

interface DashboardSection {
  id: Exclude<SectionId, 'overview'>
  title: string
  description: string
  singular: string
  icon: LucideIcon
  columns: { key: string; label: string }[]
  rows: TableRow[]
  recordLabel?: string
  readOnly?: boolean
  primaryActionLabel?: string
  readOnlyNote?: string
}

const orders = [
  { id: '#CM-2048', customer: 'Lucía Fernández', date: '16 nov, 2026', amount: 'S/ 84.50', status: 'Preparando' },
  { id: '#CM-2047', customer: 'Diego Ramírez', date: '16 nov, 2026', amount: 'S/ 52.00', status: 'Pagado' },
  { id: '#CM-2046', customer: 'Camila Torres', date: '15 nov, 2026', amount: 'S/ 112.90', status: 'En camino' },
  { id: '#CM-2045', customer: 'Mateo Salas', date: '15 nov, 2026', amount: 'S/ 39.90', status: 'Entregado' },
]

const sections: DashboardSection[] = [
  {
    id: 'products',
    title: 'Productos',
    description: 'Administra el catálogo de helados y sus niveles de stock.',
    singular: 'producto',
    icon: Package,
    columns: [
      { key: 'name', label: 'Producto' },
      { key: 'sku', label: 'SKU' },
      { key: 'category', label: 'Categoría' },
      { key: 'price', label: 'Precio' },
      { key: 'stock', label: 'Stock' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Cono Arcoíris', image: imageRainbowCone, sku: 'HEL-CON-01', category: 'Conos', price: 'S/ 4.50', stock: '42 un.', status: 'Activo' },
      { name: 'Fresa Cremosa', image: imageStrawberry, sku: 'HEL-FRE-02', category: 'Temporada', price: 'S/ 6.80', stock: '8 un.', status: 'Stock bajo' },
      { name: 'Cono Azul Mágico', image: imageBlueCone, sku: 'HEL-AZU-03', category: 'Especiales', price: 'S/ 4.20', stock: '0 un.', status: 'Agotado' },
    ],
  },
  {
    id: 'categories',
    title: 'Categorías',
    description: 'Organiza los productos en colecciones para tu catálogo.',
    singular: 'categoría',
    icon: Tags,
    columns: [
      { key: 'name', label: 'Categoría' },
      { key: 'products', label: 'Productos' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Clásicos', products: '8 productos', status: 'Activa' },
      { name: 'Frutales', products: '5 productos', status: 'Activa' },
      { name: 'Peruanos', products: '4 productos', status: 'Activa' },
      { name: 'Especiales', products: '3 productos', status: 'Activa' },
    ],
  },
  {
    id: 'flavors',
    title: 'Sabores',
    description: 'Gestiona los sabores disponibles para cada producto.',
    singular: 'sabor',
    icon: Activity,
    columns: [
      { key: 'name', label: 'Sabor' },
      { key: 'color', label: 'Color' },
      { key: 'products', label: 'En productos' },
      { key: 'status', label: 'Disponibilidad' },
    ],
    rows: [
      { name: 'Vainilla', color: '#f2d89a', products: '3 productos', status: 'Disponible' },
      { name: 'Chocolate', color: '#68402d', products: '4 productos', status: 'Disponible' },
      { name: 'Lúcuma', color: '#e5a944', products: '2 productos', status: 'Disponible' },
      { name: 'Pistacho', color: '#9ab47c', products: '1 producto', status: 'Agotado' },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventario',
    description: 'Consulta las existencias y detecta productos que necesitan reposición.',
    singular: 'movimiento de stock',
    icon: Package,
    readOnly: true,
    primaryActionLabel: 'Registrar movimiento',
    readOnlyNote: 'Los cambios de stock se registran como movimientos para mantener el historial.',
    columns: [
      { key: 'name', label: 'Producto' },
      { key: 'sku', label: 'SKU' },
      { key: 'category', label: 'Categoría' },
      { key: 'stock', label: 'Existencias' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Cono Arcoíris', image: imageRainbowCone, sku: 'HEL-CON-01', category: 'Conos', stock: '42 un.', status: 'Disponible' },
      { name: 'Fresa Cremosa', image: imageStrawberry, sku: 'HEL-FRE-02', category: 'Temporada', stock: '8 un.', status: 'Stock bajo' },
      { name: 'Cono Azul Mágico', image: imageBlueCone, sku: 'HEL-AZU-03', category: 'Especiales', stock: '0 un.', status: 'Agotado' },
    ],
  },
  {
    id: 'stock-history',
    title: 'Historial de stock',
    description: 'Consulta los movimientos de inventario y quién los registró.',
    singular: 'movimiento',
    icon: History,
    recordLabel: 'movimientos',
    readOnly: true,
    columns: [
      { key: 'date', label: 'Fecha y hora' },
      { key: 'product', label: 'Producto' },
      { key: 'movement', label: 'Movimiento' },
      { key: 'quantity', label: 'Cantidad' },
      { key: 'admin', label: 'Registrado por' },
      { key: 'note', label: 'Observación' },
    ],
    rows: [
      { date: '16 nov, 14:36', product: 'Fresa Cremosa', movement: 'Ingreso', quantity: '+24 un.', admin: 'Carlos Rojas', note: 'Reposición semanal' },
      { date: '16 nov, 13:15', product: 'Cono Azul Mágico', movement: 'Venta', quantity: '-2 un.', admin: 'Sistema', note: 'Pedido #CM-2046' },
      { date: '16 nov, 11:52', product: 'Fresa Cremosa', movement: 'Ajuste', quantity: '-1 un.', admin: 'Carlos Rojas', note: 'Corrección de inventario' },
      { date: '15 nov, 18:20', product: 'Cono Arcoíris', movement: 'Merma', quantity: '-3 un.', admin: 'Ana Morales', note: 'Producto dañado' },
      { date: '15 nov, 16:08', product: 'Cono Arcoíris', movement: 'Venta', quantity: '-1 un.', admin: 'Sistema', note: 'Pedido #CM-2045' },
    ],
  },
  {
    id: 'orders',
    title: 'Pedidos',
    description: 'Consulta las ventas y el estado de cada pedido.',
    singular: 'pedido',
    icon: ShoppingBag,
    columns: [
      { key: 'id', label: 'Pedido' },
      { key: 'customer', label: 'Cliente' },
      { key: 'date', label: 'Fecha' },
      { key: 'amount', label: 'Total' },
      { key: 'status', label: 'Estado' },
    ],
    rows: orders,
  },
  {
    id: 'customers',
    title: 'Clientes',
    description: 'Revisa la información de tus clientes y sus direcciones registradas.',
    singular: 'cliente',
    icon: UsersRound,
    columns: [
      { key: 'name', label: 'Cliente' },
      { key: 'email', label: 'Correo electrónico' },
      { key: 'orders', label: 'Pedidos' },
      { key: 'addresses', label: 'Direcciones' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Lucía Fernández', email: 'lucia.f@email.com', orders: '12', addresses: '2', status: 'Activo' },
      { name: 'Diego Ramírez', email: 'diego.r@email.com', orders: '8', addresses: '1', status: 'Activo' },
      { name: 'Camila Torres', email: 'camila.t@email.com', orders: '5', addresses: '1', status: 'Activo' },
      { name: 'Mateo Salas', email: 'mateo.s@email.com', orders: '3', addresses: '2', status: 'Activo' },
    ],
  },
  {
    id: 'users',
    title: 'Usuarios y roles',
    description: 'Administra las cuentas del equipo con acceso al panel.',
    singular: 'usuario',
    icon: UserRound,
    columns: [
      { key: 'name', label: 'Usuario' },
      { key: 'email', label: 'Correo electrónico' },
      { key: 'role', label: 'Nivel de acceso' },
      { key: 'lastAccess', label: 'Último acceso' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Carlos Rojas', email: 'carlos.rojas@email.com', role: 'SUPERADMIN', lastAccess: 'Hoy, 14:32', status: 'Activo' },
      { name: 'Ana Morales', email: 'ana.morales@email.com', role: 'ALMACÉN', lastAccess: 'Hoy, 12:10', status: 'Activo' },
      { name: 'Equipo Cremissimo', email: 'equipo@cremissimo.pe', role: 'EDITOR', lastAccess: 'Ayer, 17:45', status: 'Activo' },
    ],
  },
  {
    id: 'delivery',
    title: 'Zonas de reparto',
    description: 'Configura los distritos, tarifas y tiempos de entrega.',
    singular: 'zona',
    icon: MapPin,
    columns: [
      { key: 'name', label: 'Distrito' },
      { key: 'cost', label: 'Costo de envío' },
      { key: 'time', label: 'Tiempo estimado' },
      { key: 'status', label: 'Estado' },
    ],
    rows: [
      { name: 'Miraflores', cost: 'S/ 8.00', time: '30–45 min', status: 'Activa' },
      { name: 'San Isidro', cost: 'S/ 8.00', time: '30–45 min', status: 'Activa' },
      { name: 'Barranco', cost: 'S/ 10.00', time: '40–55 min', status: 'Activa' },
      { name: 'Surco', cost: 'S/ 12.00', time: '45–60 min', status: 'Activa' },
    ],
  },
]

const navGroups: { label: string; items: { id: SectionId; label: string; icon: LucideIcon }[] }[] = [
  { label: 'GENERAL', items: [{ id: 'overview', label: 'Resumen', icon: LayoutDashboard }] },
  {
    label: 'VENTAS',
    items: [
      { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
      { id: 'customers', label: 'Clientes', icon: UsersRound },
    ],
  },
  {
    label: 'CATÁLOGO',
    items: [
      { id: 'products', label: 'Productos', icon: Package },
      { id: 'categories', label: 'Categorías', icon: Tags },
      { id: 'flavors', label: 'Sabores', icon: Activity },
    ],
  },
  {
    label: 'INVENTARIO',
    items: [
      { id: 'inventory', label: 'Stock actual', icon: Package },
      { id: 'stock-history', label: 'Historial de stock', icon: History },
    ],
  },
  { label: 'REPARTO', items: [{ id: 'delivery', label: 'Zonas de reparto', icon: MapPin }] },
  {
    label: 'ADMINISTRACIÓN',
    items: [{ id: 'users', label: 'Usuarios y roles', icon: UserRound }],
  },
]

function StatusBadge({ status }: { status: string }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`dashboard-status dashboard-status--${statusClass}`}>{status}</span>
}

function DashboardTable({ section, query }: { section: DashboardSection; query: string }) {
  const visibleRows = section.rows.filter((row) =>
    Object.values(row).some((value) => value.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <div className="dashboard-table-scroll">
      <table className="dashboard-table">
        <thead>
          <tr>
            {section.columns.map((column) => <th key={column.key}>{column.label}</th>)}
            {!section.readOnly && <th><span className="sr-only">Acciones</span></th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, index) => (
            <tr key={`${section.id}-${index}`}>
              {section.columns.map((column) => (
                <td key={column.key}>
                  {(section.id === 'products' || section.id === 'inventory') && column.key === 'name' ? (
                    <span className="dashboard-product-cell">
                      <img src={row.image} alt="" loading="lazy" />
                      <span className="dashboard-table-primary">{row.name}</span>
                    </span>
                  ) : column.key === 'status' || column.key === 'movement' ? (
                    <StatusBadge status={row[column.key]} />
                  ) : column.key === 'color' ? (
                    <span className="dashboard-color-cell">
                      <span className="dashboard-color-swatch" style={{ backgroundColor: row[column.key] }} />
                      {row[column.key]}
                    </span>
                  ) : (
                    <span className={column.key === 'name' || column.key === 'id' ? 'dashboard-table-primary' : undefined}>
                      {row[column.key]}
                    </span>
                  )}
                </td>
              ))}
              {!section.readOnly && (
                <td className="dashboard-row-actions">
                  <button type="button" aria-label={`Editar ${section.singular}`} title="Editar (próximamente)" disabled>
                    <Pencil size={16} />
                  </button>
                  <button type="button" aria-label={`Eliminar ${section.singular}`} title="Eliminar (próximamente)" disabled>
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr><td className="dashboard-empty" colSpan={section.columns.length + (section.readOnly ? 0 : 1)}>No hay resultados para “{query}”.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Overview({ onViewInventory }: { onViewInventory: () => void }) {
  return (
    <>
      <div className="dashboard-page-heading">
        <div>
          <span className="dashboard-eyebrow">Lunes, 16 de noviembre</span>
          <h1>¡Hola, administrador!</h1>
          <p>Esto es lo que está pasando hoy en Cremissimo.</p>
        </div>
        <Link className="dashboard-store-link" to="/inicio">
          <ShoppingBag size={17} /> Ver tienda
        </Link>
      </div>

      <section className="dashboard-stats" aria-label="Resumen del negocio">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--orange"><ShoppingBag size={20} /></div>
          <span>Ventas de hoy</span>
          <strong>S/ 1,284.50</strong>
          <small className="dashboard-stat-positive"><ArrowUpRight size={14} /> 12.8% <span>vs. ayer</span></small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--blue"><Package size={20} /></div>
          <span>Pedidos recibidos</span>
          <strong>28</strong>
          <small className="dashboard-stat-positive"><ArrowUpRight size={14} /> 8.2% <span>vs. ayer</span></small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--blue"><ShoppingCart size={20} /></div>
          <span>Carritos activos</span>
          <strong>8</strong>
          <small className="dashboard-stat-positive">En curso ahora</small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--green"><UsersRound size={20} /></div>
          <span>Clientes activos</span>
          <strong>346</strong>
          <small className="dashboard-stat-positive"><ArrowUpRight size={14} /> 4.3% <span>este mes</span></small>
        </article>
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--pink"><Activity size={20} /></div>
          <span>Productos con poco stock</span>
          <strong>2</strong>
          <small className="dashboard-stat-warning"><ArrowDownRight size={14} /> Requieren atención</small>
        </article>
      </section>

      <section className="dashboard-overview-grid">
        <article className="dashboard-panel dashboard-sales-panel">
          <div className="dashboard-panel-heading">
            <div><h2>Ventas de la semana</h2><p>Un vistazo a tus ingresos recientes</p></div>
            <button type="button" className="dashboard-select" disabled>Esta semana <ChevronDown size={15} /></button>
          </div>
          <div className="dashboard-chart">
            <div className="dashboard-chart-y-axis"><span>S/ 1.5k</span><span>S/ 1k</span><span>S/ 500</span><span>S/ 0</span></div>
            <div className="dashboard-chart-main">
              <div className="dashboard-chart-gridlines"><i /><i /><i /><i /></div>
              <div className="dashboard-chart-bars">
                {[42, 64, 51, 82, 61, 93, 73].map((height, index) => (
                  <div className="dashboard-chart-day" key={index}>
                    <div className="dashboard-chart-bar-wrap"><span className={`dashboard-chart-bar${index === 5 ? ' is-highlighted' : ''}`} style={{ height: `${height}%` }} /></div>
                    <span>{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-chart-legend"><span /> Ingresos <strong>S/ 8,642.80</strong></div>
        </article>

        <article className="dashboard-panel dashboard-stock-panel">
          <div className="dashboard-panel-heading">
            <div><h2>Stock por revisar</h2><p>Productos que necesitan atención</p></div>
            <span className="dashboard-alert-count">2</span>
          </div>
          <div className="dashboard-stock-list">
            <div><span className="dashboard-stock-dot dashboard-stock-dot--low" /><span><strong>Fresa Cremosa</strong><small>Quedan 8 unidades</small></span><span className="dashboard-stock-pill">Bajo</span></div>
            <div><span className="dashboard-stock-dot dashboard-stock-dot--empty" /><span><strong>Cono Azul Mágico</strong><small>Sin unidades</small></span><span className="dashboard-stock-pill is-empty">Agotado</span></div>
          </div>
          <button type="button" className="dashboard-stock-link" onClick={onViewInventory}>Ver inventario <span>→</span></button>
        </article>
      </section>

      <section className="dashboard-panel dashboard-recent-panel">
        <div className="dashboard-panel-heading">
          <div><h2>Pedidos recientes</h2><p>Los últimos pedidos de tu tienda</p></div>
          <span className="dashboard-subtle-link">Últimos 4 pedidos</span>
        </div>
        <table className="dashboard-table dashboard-recent-table">
          <thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{orders.map((order) => (
            <tr key={order.id}>
              <td><span className="dashboard-table-primary">{order.id}</span></td>
              <td>{order.customer}</td><td>{order.date}</td><td>{order.amount}</td>
              <td><StatusBadge status={order.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </>
  )
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const selectedSection = useMemo(
    () => sections.find((section) => section.id === activeSection),
    [activeSection],
  )

  function selectSection(id: SectionId) {
    setActiveSection(id)
    setQuery('')
    setSidebarOpen(false)
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="dashboard-brand">
          <Link to="/inicio" aria-label="Cremissimo, ir a la tienda"><img src={logoCremissimo} alt="Cremissimo" /></Link>
          <span>ADMINISTRACIÓN</span>
        </div>
        <nav className="dashboard-nav" aria-label="Navegación de administración">
          {navGroups.map((group) => (
            <div className="dashboard-nav-group" key={group.label}>
              <span className="dashboard-nav-label">{group.label}</span>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  className={`dashboard-nav-item${activeSection === id ? ' is-active' : ''}`}
                  onClick={() => selectSection(id)}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
                  {id === 'orders' && <span className="dashboard-nav-badge">5</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-profile">
            <div className="dashboard-avatar">CR</div>
            <span><strong>Carlos Rojas</strong><small>Administrador</small></span>
            <ChevronDown size={16} />
          </div>
          <Link to="/login" className="dashboard-logout"><LogOut size={17} /> Cerrar sesión</Link>
        </div>
      </aside>

      {sidebarOpen && <button className="dashboard-backdrop" type="button" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)} />}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button type="button" className="dashboard-menu-toggle" aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div className="dashboard-breadcrumb"><span>Administración</span><span>/</span><strong>{selectedSection?.title ?? 'Resumen'}</strong></div>
          <div className="dashboard-topbar-actions">
            <span className="dashboard-live-status"><i /> Tienda activa</span>
            <button type="button" className="dashboard-notification" aria-label="Notificaciones">
              <Bell size={19} /><i />
            </button>
            <Link to="/inicio" className="dashboard-topbar-store"><ShoppingBag size={16} /> Ir a la tienda</Link>
          </div>
        </header>

        <div className="dashboard-content">
          {selectedSection ? (
            <>
              <div className="dashboard-page-heading dashboard-list-heading">
                <div>
                  <span className="dashboard-eyebrow">GESTIÓN DE {selectedSection.title.toUpperCase()}</span>
                  <h1>{selectedSection.title}</h1>
                  <p>{selectedSection.description}</p>
                </div>
                {(!selectedSection.readOnly || selectedSection.primaryActionLabel) && (
                  <button
                    type="button"
                    className="dashboard-primary-button"
                    disabled
                    title={selectedSection.primaryActionLabel ? 'Disponible en una próxima etapa' : 'La creación estará disponible próximamente'}
                  >
                    <Plus size={18} /> {selectedSection.primaryActionLabel ?? `Nuevo ${selectedSection.singular}`}
                  </button>
                )}
              </div>

              <section className="dashboard-panel dashboard-data-panel">
                <div className="dashboard-list-toolbar">
                  <div><strong>{selectedSection.rows.length} {selectedSection.recordLabel ?? selectedSection.title.toLowerCase()}</strong><span>Datos de muestra para la vista previa</span></div>
                  <label className="dashboard-search">
                    <Search size={17} />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Buscar ${selectedSection.title.toLowerCase()}...`} />
                  </label>
                </div>
                <DashboardTable section={selectedSection} query={query} />
                <div className="dashboard-table-footer">
                  <span>Mostrando {selectedSection.rows.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(query.toLowerCase()))).length} de {selectedSection.rows.length} registros</span>
                  <div><button type="button" disabled>Anterior</button><button type="button" className="is-current">1</button><button type="button" disabled>Siguiente</button></div>
                </div>
              </section>
              <p className="dashboard-placeholder-note">
                <Clock3 size={15} />
                {selectedSection.readOnly
                  ? selectedSection.readOnlyNote ?? 'Vista de solo lectura; estos registros se generan automáticamente por la operación.'
                  : 'Las acciones de crear, editar y eliminar se habilitarán en una próxima etapa.'}
              </p>
            </>
          ) : (
            <Overview onViewInventory={() => selectSection('inventory')} />
          )}
          <footer className="dashboard-footer">© 2026 Cremissimo <span>Hecho con <b>♥</b> y mucho helado</span></footer>
        </div>
      </main>
    </div>
  )
}
