import { useQuery } from '@tanstack/react-query'
import ProductoCard, { type Producto } from './producto_card'
import './productos.css'

interface Props {
  onAgregar: (producto: Producto) => void
}

// Interfaz que refleja el JSON que envía el backend según tu clase Helado.java
interface HeladoBackend {
  idHelado: number
  nombre: string
  precio: number
  urlImagen: string
  sabor: {
    nombre: string
  }
}

// Función para obtener y transformar los datos
const fetchHelados = async (): Promise<Producto[]> => {
  const response = await fetch('http://localhost:8080/api/helados/listar')
  
  if (!response.ok) {
    throw new Error('Error al obtener los helados del servidor')
  }

  const data: HeladoBackend[] = await response.json()

  // Mapeamos los datos del backend a la interfaz Producto del frontend
  return data.map((helado) => ({
    id: helado.idHelado,
    nombre: helado.nombre,
    sabor: helado.sabor.nombre,
    precio: helado.precio,
    imagen: helado.urlImagen,
  }))
}

function Productos({ onAgregar }: Props) {
  // Implementación de TanStack Query
  const { data: productos, isLoading, isError, error } = useQuery({
    queryKey: ['helados'],
    queryFn: fetchHelados,
  })

  return (
    <section className="productos-section" id="productos">
      <div className="productos-titulo">
        <span className="catalogo">🍦 Catálogo Completo</span>
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