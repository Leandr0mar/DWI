import './filtros_productos.css'

export type Orden = 'default' | 'precio-asc' | 'precio-desc' | 'nombre'

export interface Filtros {
  busqueda: string
  sabor: string
  precioMin: string
  precioMax: string
  orden: Orden
}

export const filtrosIniciales: Filtros = {
  busqueda: '',
  sabor: '',
  precioMin: '',
  precioMax: '',
  orden: 'default',
}

interface Props {
  filtros: Filtros
  sabores: string[]
  total?: number
  onChange: (filtros: Filtros) => void
}

function FiltrosProductos({ filtros, sabores, total, onChange }: Props) {
  const actualizar = (cambio: Partial<Filtros>) => onChange({ ...filtros, ...cambio })

  const hayFiltros =
    filtros.busqueda !== '' ||
    filtros.sabor !== '' ||
    filtros.precioMin !== '' ||
    filtros.precioMax !== '' ||
    filtros.orden !== 'default'

  return (
    <div className="filtros" role="search" aria-label="Filtros de productos">
      <label className="filtros-campo filtros-busqueda">
        Buscar
        <input
          type="search"
          value={filtros.busqueda}
          onChange={(e) => actualizar({ busqueda: e.target.value })}
          placeholder="Ej. fresa, chocolate..."
        />
      </label>

      <label className="filtros-campo">
        Sabor
        <select value={filtros.sabor} onChange={(e) => actualizar({ sabor: e.target.value })}>
          <option value="">Todos</option>
          {sabores.map((sabor) => (
            <option key={sabor} value={sabor}>
              {sabor}
            </option>
          ))}
        </select>
      </label>

      <div className="filtros-campo">
        <span>Precio (S/.)</span>
        <div className="filtros-precio">
          <input
            type="number"
            min="0"
            step="0.5"
            value={filtros.precioMin}
            onChange={(e) => actualizar({ precioMin: e.target.value })}
            placeholder="Mín"
            aria-label="Precio mínimo"
          />
          <span aria-hidden="true">–</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={filtros.precioMax}
            onChange={(e) => actualizar({ precioMax: e.target.value })}
            placeholder="Máx"
            aria-label="Precio máximo"
          />
        </div>
      </div>

      <label className="filtros-campo">
        Ordenar por
        <select value={filtros.orden} onChange={(e) => actualizar({ orden: e.target.value as Orden })}>
          <option value="default">Recomendados</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </label>

      <div className="filtros-pie">
        <span className="filtros-total" aria-live="polite">
          {total === undefined ? '' : `${total} ${total === 1 ? 'helado' : 'helados'}`}
        </span>
        {hayFiltros && (
          <button type="button" className="filtros-limpiar" onClick={() => onChange(filtrosIniciales)}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default FiltrosProductos
