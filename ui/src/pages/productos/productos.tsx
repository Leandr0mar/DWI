import HeroProductos from '../../componets/productos/HeroProductos'
import Productos from '../../componets/productos/productos'

// Página con el catálogo completo de helados
// (en administrador se implementarán más archivos tsx para cada apartado CRUD y demás)
function ProductosPage() {
  return (
    <>
      <HeroProductos />
      <Productos />
    </>
  )
}

export default ProductosPage
