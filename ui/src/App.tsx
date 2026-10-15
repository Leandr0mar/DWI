import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './componets/common/layout/Layout'
import Home from './pages/home/home'
import Nosotros from './pages/home/nosotros'
import Contactos from './pages/home/contactos'
import Productos from './pages/productos/productos'

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
			</Routes>
		</BrowserRouter>
	)
}

export default App
