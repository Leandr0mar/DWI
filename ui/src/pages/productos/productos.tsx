import Productos from '../../componets/productos/productos'
import { useLayout } from '../../componets/common/layout/Layout'

// Página con el catálogo completo de helados
// (en administrador se implementarán más archivos tsx para cada apartado CRUD y demás)
function ProductosPage() {
  const { agregarAlCarrito } = useLayout()

  return <Productos onAgregar={agregarAlCarrito} />
}

export default ProductosPage
