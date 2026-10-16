import { useEffect, useState } from 'react'
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

const DEFAULT_AVATAR = `${import.meta.env.BASE_URL}avatar-default.svg`

function UserIdentity({ usuario }: { usuario: AuthUser }) {
  const avatar = usuario.avatarUrl?.trim() || DEFAULT_AVATAR

  return (
    <>
      <img
        src={avatar}
        alt={`Foto de perfil de ${usuario.nombreCompleto}`}
        className="header-user-avatar"
        loading="eager"
        decoding="async"
        fetchPriority="high"
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

  useEffect(() => {
    const avatarPredeterminado = new Image()
    avatarPredeterminado.src = DEFAULT_AVATAR
    void avatarPredeterminado.decode().catch(() => undefined)
  }, [])

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
        <Link to="/inicio" className="header-logo-link" aria-label="Ir al inicio">
          <img src={logoCremissimo} alt="Logo Cremissimo" className="header-logo-img" />
        </Link>

        <nav className="header-nav-desktop">
          <Link to="/inicio" className="header-nav-link">Inicio</Link>
          <Link to="/nosotros" className="header-nav-link">Nosotros</Link>
          <Link to="/productos" className="header-nav-link">Productos</Link>
          <Link to="/contactos" className="header-nav-link">Contactos</Link>
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
            className={`header-menu-toggle${menuAbierto ? ' is-open' : ''}`}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            aria-controls="header-mobile-menu"
          >
            <span className="header-menu-bar header-menu-bar-top"></span>
            <span className="header-menu-bar header-menu-bar-middle"></span>
            <span className="header-menu-bar header-menu-bar-bottom"></span>
          </button>
        </div>
      </div>

      <div
        id="header-mobile-menu"
        className={`header-nav-mobile${menuAbierto ? ' is-open' : ''}`}
        aria-hidden={!menuAbierto}
        inert={!menuAbierto}
      >
          <Link to="/inicio" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Inicio</Link>
          <Link to="/nosotros" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Nosotros</Link>
          <Link to="/productos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Productos</Link>
          <Link to="/contactos" className="header-mobile-link" onClick={() => setMenuAbierto(false)}>Contactos</Link>

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
    </header>
  )
}
