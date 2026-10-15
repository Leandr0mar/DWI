import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/home'
import Login from './pages/auth/login'
import Registro from './pages/auth/registro'
import ContrasenaPerdida from './pages/auth/contrasena-perdida'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/inicio" replace />} />
				<Route path="/inicio" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/recuperar-contrasena" element={<ContrasenaPerdida />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
