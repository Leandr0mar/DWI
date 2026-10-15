import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ProductoCard, { type Producto } from './ProductoCard'
import FiltrosProductos, { filtrosIniciales, type Filtros } from './FiltrosProductos'
import './productos.css'

interface Props {
  onAgregar: (producto: Producto) => void
}

// Interfaz para la entidad Sabor que envía el backend
interface SaborBackend {
  id: number
  nombre: string
}

// Interfaz adaptada a la relación @ManyToMany de Helado.java
interface HeladoBackend {
  idHelado: number
  nombre: string
  precio: number
  urlImagen: string
  sabores: SaborBackend[]
}

// Función para obtener y transformar los datos
const fetchHelados = async (): Promise<Producto[]> => {
  const response = await fetch('http://localhost:8080/api/helados/listar')

  if (!response.ok) {
    throw new Error('Error al obtener los helados del servidor')
  }

  const data: HeladoBackend[] = await response.json()

  // Mapeamos los datos y unimos los nombres de los sabores
  return data.map((helado) => {
    const sabores = helado.sabores?.map((s) => s.nombre) ?? []
    return {
      id: helado.idHelado,
      nombre: helado.nombre,
      sabor: sabores.length > 0 ? sabores.join(', ') : 'Varios sabores',
      sabores,
      precio: helado.precio,
      imagen: helado.urlImagen,
    }
  })
}

// Aplica búsqueda, sabor, rango de precio y orden
function filtrarProductos(productos: Producto[], filtros: Filtros): Producto[] {
  const texto = filtros.busqueda.trim().toLowerCase()
  const min = filtros.precioMin === '' ? null : Number(filtros.precioMin)
  const max = filtros.precioMax === '' ? null : Number(filtros.precioMax)

  const resultado = productos.filter((p) => {
    if (texto && !`${p.nombre} ${p.sabor}`.toLowerCase().includes(texto)) return false
    if (filtros.sabor && !p.sabores.includes(filtros.sabor)) return false
    if (min !== null && p.precio < min) return false
    if (max !== null && p.precio > max) return false
    return true
  })

  switch (filtros.orden) {
    case 'precio-asc':
      return [...resultado].sort((a, b) => a.precio - b.precio)
    case 'precio-desc':
      return [...resultado].sort((a, b) => b.precio - a.precio)
    case 'nombre':
      return [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    default:
      return resultado
  }
}

function Productos({ onAgregar }: Props) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales)

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['helados'],
    queryFn: fetchHelados,
  })

  // Lista de sabores disponibles, armada con los que traen los helados
  const saboresDisponibles = Array.from(
    new Set((productos ?? []).flatMap((p) => p.sabores)),
  ).sort((a, b) => a.localeCompare(b, 'es'))

  const productosFiltrados = filtrarProductos(productos ?? [], filtros)

  return (
    <section className="productos-section" id="productos">
      <div className="productos-titulo">
        <h2>Todos Nuestros Sabores</h2>
        <p>Más de 20 sabores artesanales para todos los gustos. ¿Cuál es tu favorito?</p>
      </div>

      {/* Los filtros se muestran siempre; el total solo cuando ya cargaron los helados */}
      <FiltrosProductos
        filtros={filtros}
        sabores={saboresDisponibles}
        total={isLoading || isError ? undefined : productosFiltrados.length}
        onChange={setFiltros}
      />

      {/* Manejo de estados de carga y error */}
      {isLoading && <p className="text-center">Cargando deliciosos helados...</p>}

      {isError && (
        <p className="text-center">
          Ocurrió un error: vuelve a intentarlo más tarde.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {productosFiltrados.length === 0 ? (
            <p className="productos-vacio">No encontramos helados con esos filtros.</p>
          ) : (
            <div className="productos-grid">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={onAgregar}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Productos
