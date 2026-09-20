import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/home'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/inicio" replace />} />
				<Route path="/inicio" element={<Home />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App

