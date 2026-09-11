import { useQuery } from '@tanstack/react-query'
import ProductoCard, { type Producto } from './producto_card'
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
  return data.map((helado) => ({
    id: helado.idHelado,
    nombre: helado.nombre,
    sabor: helado.sabores && helado.sabores.length > 0
      ? helado.sabores.map((s) => s.nombre).join(', ')
      : 'Varios sabores',
    precio: helado.precio,
    imagen: helado.urlImagen,
  }))
}

function Productos({ onAgregar }: Props) {
  const { data: productos, isLoading, isError, error } = useQuery({
    queryKey: ['helados'],
    queryFn: fetchHelados,
  })

  return (
    <section className="productos-section" id="productos">
      <div className="productos-titulo">
        <h2>Todos Nuestros Sabores</h2>
        <p>Más de 20 sabores artesanales para todos los gustos. ¿Cuál es tu favorito?</p>
      </div>

      {/* Manejo de estados de carga y error */}
      {isLoading && <p className="text-center">Cargando deliciosos helados...</p>}
      
      {isError && (
        <p className="text-center text-red-500">
          Ocurrió un error: {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
      )}

      {/* Renderizado del Grid */}
      {!isLoading && !isError && (
        <div className="productos-grid">
          {productos?.map((producto) => (
            <ProductoCard 
              key={producto.id} 
              producto={producto} 
              onAgregar={onAgregar}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Productos