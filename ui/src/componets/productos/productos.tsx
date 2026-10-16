import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ProductoCard, { type ProductoCatalogo } from './ProductoCard'
import FiltrosProductos, { filtrosIniciales, type Filtros } from './FiltrosProductos'
import './productos.css'
import imagenProductoPredeterminada from '../../assets/productos_destacados/pd_1.jpg'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface ProductoBackend {
  id: number
  uuid: string
  sku: string
  nombre: string
  descripcion: string | null
  precioBase: number
  stockDisponible: number
  categoria: string
  sabores: string[]
  urlImagen: string | null
  pesoVolumen: string | null
  tipoPresentacion: string | null
}

const fetchProductos = async (): Promise<ProductoCatalogo[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/catalogo/productos`)
  
  if (!response.ok) {
    throw new Error(`No se pudieron cargar los productos (HTTP ${response.status}).`)
  }

  const data: ProductoBackend[] = await response.json()

  return data.map((producto) => ({
    id: producto.id,
    uuid: producto.uuid,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    stockDisponible: producto.stockDisponible,
    pesoVolumen: producto.pesoVolumen,
    tipoPresentacion: producto.tipoPresentacion,
    sabor: producto.sabores.length > 0
      ? producto.sabores.join(', ')
      : 'Varios sabores',
    precio: producto.precioBase,
    imagen: producto.urlImagen?.trim() || imagenProductoPredeterminada,
  }))
}

function Productos() {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales)
  const { data: productos, isLoading, isError, error } = useQuery({
    queryKey: ['productos-catalogo'],
    queryFn: fetchProductos,
  })

  const categorias = useMemo(
    () => [...new Set((productos ?? []).map((producto) => producto.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [productos],
  )

  const productosFiltrados = useMemo(() => {
    const nombreBuscado = filtros.nombre.trim().toLocaleLowerCase('es')
    const resultado = (productos ?? []).filter((producto) => {
      const coincideNombre = producto.nombre.toLocaleLowerCase('es').includes(nombreBuscado)
      const coincideCategoria = !filtros.categoria || producto.categoria === filtros.categoria
      const coincideDisponibilidad = filtros.disponibilidad === 'todos'
        || (filtros.disponibilidad === 'disponibles' && producto.stockDisponible > 0)
        || (filtros.disponibilidad === 'agotados' && producto.stockDisponible <= 0)
      return coincideNombre && coincideCategoria && coincideDisponibilidad
    })

    switch (filtros.orden) {
      case 'precio-asc': return resultado.sort((a, b) => a.precio - b.precio)
      case 'precio-desc': return resultado.sort((a, b) => b.precio - a.precio)
      case 'nombre-asc': return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
      case 'nombre-desc': return resultado.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }))
      default: return resultado
    }
  }, [productos, filtros])

  return (
    <section className="productos-section" id="productos">
      <div className="productos-titulo">
        <h2>Todos Nuestros Sabores</h2>
        <p>Más de 20 sabores artesanales para todos los gustos. ¿Cuál es tu favorito?</p>
      </div>

      {/* Manejo de estados de carga y error */}
      {isLoading && <p className="text-center">Cargando deliciosos helados...</p>}
      
      {isError && (
        <p className="text-center">
          {error instanceof Error ? error.message : 'Ocurrió un error: vuelve a intentarlo más tarde.'}
        </p>
      )}

      {!isLoading && !isError && productos?.length === 0 && (
        <p className="text-center">Pronto agregaremos productos a nuestro catálogo.</p>
      )}

      {/* Renderizado del Grid */}
      {!isLoading && !isError && productos && productos.length > 0 && (
        <>
          <FiltrosProductos filtros={filtros} categorias={categorias} total={productosFiltrados.length} onChange={setFiltros} />
          {productosFiltrados.length > 0 ? (
            <div className="productos-grid">
              {productosFiltrados.map((producto) => <ProductoCard key={producto.id} producto={producto} />)}
            </div>
          ) : (
            <p className="productos-vacio">No encontramos productos con esos filtros. Prueba con otros criterios.</p>
          )}
        </>
      )}
    </section>
  )
}

export default Productos
