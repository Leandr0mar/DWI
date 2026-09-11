import './productos_destacados.css'
import { useState } from 'react'
import imagenPD1 from '../../assets/productos_destacados/pd_1.jpg'
import imagenPD2 from '../../assets/productos_destacados/pd_2.jpg'
import imagenPD3 from '../../assets/productos_destacados/pd_3.jpg'
const products = [
	{
		badge: '⭐ Más vendido',
		badgeClass: 'is-best-seller',
		imageClass: 'product-image-cone',
		image: imagenPD1,
		imageLabel: 'Imagen del cono de cookies',
		name: 'Cono Arcoíris',
		description: 'Tres sabores artesanales en cono de waffle crujiente con lluvia de colores.',
		price: 'S/ 4.50',
	},
	{
		badge: '🍓 Temporada',
		badgeClass: 'is-seasonal',
		imageClass: 'product-image-strawberry',
		image: imagenPD2,
		imageLabel: 'Imagen del helado de fresa',
		name: 'Fresa Cremosa',
		description: 'Helado artesanal de fresa fresca con trocitos de fruta real y crema batida.',
		price: 'S/ 6.80',
	},
	{
		badge: '✨ Nuevo',
		badgeClass: 'is-new',
		imageClass: 'product-image-blue',
		image: imagenPD3,
		imageLabel: 'Imagen del cono azul mágico',
		name: 'Cono Azul Mágico',
		description: 'Sorpresa de arándano y menta azul, visualmente impactante y delicioso.',
		price: 'S/ 4.20',
	},
]

function ProductImage({ imageClass, imageLabel, image }: { imageClass: string; imageLabel: string; image: string }) {
	return (
		<div className={`product-image-placeholder ${imageClass}`}>
			<img src={image} alt={imageLabel} />
		</div>
	)
}

function ProductosDestacados() {
	const [addedProducts, setAddedProducts] = useState<Record<string, boolean>>({})

	function handleAddProduct(productName: string) {
		setAddedProducts((currentProducts) => ({
			...currentProducts,
			[productName]: true,
		}))

		window.setTimeout(() => {
			setAddedProducts((currentProducts) => ({
				...currentProducts,
				[productName]: false,
			}))
		}, 1500)
	}

	return (
		<section className="productos-section" id="destacados" aria-labelledby="productos-title">
			<div className="productos-heading">
				<h2 id="productos-title">Productos Destacados</h2>
				<p>Los favoritos de la semana, seleccionados por nuestros maestros heladeros.</p>
			</div>

			<div className="productos-destacados-grid">
				{products.map((product) => (
					<article className="producto-card" key={product.name}>
						<ProductImage
							imageClass={product.imageClass}
							imageLabel={product.imageLabel}
							image={product.image}
						/>
						<div className="producto-content">
							<span className={`producto-badge ${product.badgeClass}`}>{product.badge}</span>
							<h3>{product.name}</h3>
							<p>{product.description}</p>
							<div className="producto-footer">
								<strong>{product.price}</strong>
								<button
									type="button"
									className={addedProducts[product.name] ? 'is-added' : ''}
									onClick={() => handleAddProduct(product.name)}
									aria-pressed={Boolean(addedProducts[product.name])}
								>
									{addedProducts[product.name] ? '✓ Agregado' : 'Agregar'}
								</button>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default ProductosDestacados