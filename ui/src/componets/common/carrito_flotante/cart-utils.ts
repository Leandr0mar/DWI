import type { Producto } from '../../productos/ProductoCard'

export interface LineaCarrito {
  producto: Producto
  cantidad: number
}

export function agruparProductos(carrito: Producto[]): LineaCarrito[] {
  const lineas = new Map<string, LineaCarrito>()

  for (const producto of carrito) {
    const llave = `${producto.id}:${producto.sabor}`
    const linea = lineas.get(llave)
    if (linea) linea.cantidad += 1
    else lineas.set(llave, { producto, cantidad: 1 })
  }

  return Array.from(lineas.values())
}

export function calcularSubtotal(carrito: Producto[]): number {
  return carrito.reduce((suma, producto) => suma + producto.precio, 0)
}
