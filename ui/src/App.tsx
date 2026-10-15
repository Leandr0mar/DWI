import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './componets/common/layout/Layout'
import Home from './pages/home/home'
import Nosotros from './pages/home/nosotros'
import Contactos from './pages/home/contactos'
import Productos from './pages/productos/productos'
import Login from './pages/auth/login'
import Registro from './pages/auth/registro'
import ContrasenaPerdida from './pages/auth/contrasena-perdida'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/inicio" replace />} />

				<Route element={<Layout />}>
					<Route path="/inicio" element={<Home />} />
					<Route path="/nosotros" element={<Nosotros />} />
					<Route path="/productos" element={<Productos />} />
					<Route path="/contactos" element={<Contactos />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/recuperar-contrasena" element={<ContrasenaPerdida />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
