import './filtros_productos.css'

export type Orden = 'default' | 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc'

export interface Filtros {
  nombre: string
  categoria: string
  orden: Orden
  disponibilidad: 'todos' | 'disponibles' | 'agotados'
}

export const filtrosIniciales: Filtros = {
  nombre: '',
  categoria: '',
  orden: 'default',
  disponibilidad: 'todos',
}

interface Props {
  filtros: Filtros
  categorias: string[]
  total?: number
  onChange: (filtros: Filtros) => void
}

function FiltrosProductos({ filtros, categorias, total, onChange }: Props) {
  const actualizar = (cambio: Partial<Filtros>) => onChange({ ...filtros, ...cambio })
  const hayFiltros = filtros.nombre !== '' || filtros.categoria !== '' || filtros.orden !== 'default' || filtros.disponibilidad !== 'todos'

  return (
    <div className="filtros" role="search" aria-label="Filtros de productos">
      <label className="filtros-campo filtros-busqueda">
        Buscar por nombre
        <input
          type="search"
          value={filtros.nombre}
          onChange={(event) => actualizar({ nombre: event.target.value })}
          placeholder="Escribe el nombre del producto"
        />
      </label>

      <label className="filtros-campo">
        Categoría
        <select value={filtros.categoria} onChange={(event) => actualizar({ categoria: event.target.value })}>
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
        </select>
      </label>

      <label className="filtros-campo">
        Ordenar por
        <select value={filtros.orden} onChange={(event) => actualizar({ orden: event.target.value as Orden })}>
          <option value="default">Orden del catálogo</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre-asc">Nombre: A–Z</option>
          <option value="nombre-desc">Nombre: Z–A</option>
        </select>
      </label>

      <label className="filtros-campo">
        Disponibilidad
        <select value={filtros.disponibilidad} onChange={(event) => actualizar({ disponibilidad: event.target.value as Filtros['disponibilidad'] })}>
          <option value="todos">Todos</option>
          <option value="disponibles">Disponibles</option>
          <option value="agotados">Agotados</option>
        </select>
      </label>

      <div className="filtros-pie">
        <span className="filtros-total" aria-live="polite">
          {total === undefined ? '' : `${total} ${total === 1 ? 'producto' : 'productos'}`}
        </span>
        {hayFiltros && <button type="button" className="filtros-limpiar" onClick={() => onChange(filtrosIniciales)}>Limpiar filtros</button>}
      </div>
    </div>
  )
}

export default FiltrosProductos
