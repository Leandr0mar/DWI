import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AUTH_USER_QUERY_KEY,
  AuthApiError,
  cerrarSesion as solicitarCierreSesion,
  obtenerUsuarioActual,
  type AuthUser,
} from '../../../services/auth'
import './header.css'
import logoCremissimo from '../../../assets/logo/img_logo3.png'

const DEFAULT_AVATAR = '/avatar-default.svg'

function UserIdentity({ usuario }: { usuario: AuthUser }) {
  const avatar = usuario.avatarUrl?.trim() || DEFAULT_AVATAR

  return (
    <>
      <img
        src={avatar}
        alt={`Foto de perfil de ${usuario.nombreCompleto}`}
        className="header-user-avatar"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = DEFAULT_AVATAR
        }}
      />
      <span className="header-user-details">
        <span className="header-user-name">{usuario.nombreCompleto}</span>
      </span>
    </>
  )
}

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const queryClient = useQueryClient()
  const usuarioQuery = useQuery<AuthUser | null>({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await obtenerUsuarioActual()
      } catch (error) {
        if (error instanceof AuthApiError && error.status === 401) return null
        throw error
      }
    },
    retry: false,
  })
  const logoutMutation = useMutation({
    mutationFn: solicitarCierreSesion,
    onSuccess: () => queryClient.setQueryData(AUTH_USER_QUERY_KEY, null),
  })
  const usuario = usuarioQuery.data ?? null

  function handleLogout() {
    logoutMutation.mutate()
    setMenuAbierto(false)
  }

  return (
    <header className="header-navbar">
      <div className="header-container">
        <a href="#inicio" className="header-logo-link">
          <img src={logoCremissimo} alt="Logo Cremissimo" className="header-logo-img" />
        </a>

        <nav className="header-nav-desktop">
          <a href="#inicio" className="header-nav-link">Inicio</a>
          <a href="#nosotros" className="header-nav-link">Nosotros</a>
          <a href="#productos" className="header-nav-link">Productos</a>
          <a href="#contactos" className="header-nav-link">Contactos</a>
        </nav>

        <div className="header-actions">
          <div className="header-auth-container">
            {usuarioQuery.isPending ? null : usuario ? (
              <div className="header-user-actions">
                <div className="header-user-profile header-user-profile-plain">
                  <UserIdentity usuario={usuario} />
                </div>
                <button className="header-btn-logout" onClick={handleLogout} disabled={logoutMutation.isPending} title="Cerrar sesión">
                  {logoutMutation.isPending ? 'Saliendo…' : 'Salir'}
                </button>
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Link to="/login" className="header-btn-login">Iniciar Sesión</Link>
                <Link to="/registro" className="header-btn-register">Registrarse</Link>
              </div>
            )}
          </div>

          <button
            className="header-menu-toggle"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
            <span className="header-menu-bar"></span>
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="header-nav-mobile">
          <a href="#inicio" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Inicio</a>
          <a href="#nosotros" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Nosotros</a>
          <a href="#productos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Productos</a>
          <a href="#contactos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Contactos</a>

          <div className="header-mobile-auth">
            {usuarioQuery.isPending ? null : usuario ? (
              <div className="header-mobile-user">
                <div className="header-mobile-user-info header-user-profile-plain">
                  <UserIdentity usuario={usuario} />
                </div>
                <button className="header-btn-logout" onClick={handleLogout} disabled={logoutMutation.isPending} title="Cerrar sesión">
                  {logoutMutation.isPending ? 'Saliendo…' : 'Salir'}
                </button>
              </div>
            ) : (
              <div className="header-mobile-auth-btns">
                <Link to="/login" className="header-btn-login" onClick={() => setMenuAbierto(false)}>Iniciar Sesión</Link>
                <Link to="/registro" className="header-btn-register" onClick={() => setMenuAbierto(false)}>Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
