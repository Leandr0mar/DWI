import './App.css'
import { useQuery } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AUTH_USER_QUERY_KEY, obtenerUsuarioActual } from './services/auth'
import Home from './pages/home/home'
import Login from './pages/auth/login'
import Registro from './pages/auth/registro'
import ContrasenaPerdida from './pages/auth/contrasena-perdida'
import NosotrosPage from './pages/home/nosotros'
import ContactosPage from './pages/home/contactos'
import ProductosPage from './pages/productos/productos'
import ProductosDetalle from './pages/productos/productos-detalle'
import Layout from './componets/common/layout/Layout'
import PageFade from './componets/common/layout/PageFade'
import Dashboard from './pages/administrador/dashboard'
import CarritoPage from './pages/compra/carrito'
import CheckoutPage from './pages/compra/checkout'
import CompraConfirmadaPage from './pages/compra/confirmacion'

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
	const usuarioQuery = useQuery({
		queryKey: AUTH_USER_QUERY_KEY,
		queryFn: obtenerUsuarioActual,
		retry: false,
		refetchOnMount: 'always',
	})

	if (usuarioQuery.isPending) {
		return <main className="dashboard-auth-loading" role="status">Verificando acceso…</main>
	}

	if (usuarioQuery.isError || usuarioQuery.data?.rolSistema !== 'ADMIN') {
		return <Navigate to="/inicio" replace />
	}

	return children
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/inicio" replace />} />
				<Route element={<Layout />}>
					<Route path="/inicio" element={<Home />} />
					<Route path="/nosotros" element={<NosotrosPage />} />
					<Route path="/contactos" element={<ContactosPage />} />
					<Route path="/productos" element={<ProductosPage />} />
					<Route path="/productos/:uuid" element={<ProductosDetalle />} />
					<Route path="/carrito" element={<CarritoPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/compra/confirmacion" element={<CompraConfirmadaPage />} />
				</Route>
				<Route path="/login" element={<PageFade><Login /></PageFade>} />
				<Route path="/registro" element={<PageFade><Registro /></PageFade>} />
				<Route path="/recuperar-contrasena" element={<PageFade><ContrasenaPerdida /></PageFade>} />
				<Route path="/administrador/dashboard" element={<AdminOnlyRoute><Dashboard /></AdminOnlyRoute>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
