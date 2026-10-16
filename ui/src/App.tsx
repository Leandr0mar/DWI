import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
				</Route>
				<Route path="/login" element={<PageFade><Login /></PageFade>} />
				<Route path="/registro" element={<PageFade><Registro /></PageFade>} />
				<Route path="/recuperar-contrasena" element={<PageFade><ContrasenaPerdida /></PageFade>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
