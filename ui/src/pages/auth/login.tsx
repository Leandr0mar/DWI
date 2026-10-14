import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthShell, Field, SubmitButton, SuccessMessage } from "../../componets/auth/authcomponents";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthShell
      eyebrow="Bienvenido de nuevo"
      title="Inicia sesión"
      description="Accede a tu cuenta para continuar disfrutando tus sabores favoritos."
    >
      {submitted ? (
        <SuccessMessage
          title="Datos recibidos"
          description="Tu formulario está listo para conectarse con el servicio de autenticación."
          action="Volver al inicio"
          to="/"
        />
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field id="login-email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email" />
          <div className="auth-field">
            <Field id="login-password" label="Contraseña" type="password" placeholder="Ingresa tu contraseña" autoComplete="current-password" />
            <div className="auth-forgot-link">
              <Link to="/recuperar-contrasena" className="auth-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <label className="auth-checkbox-label">
            <input type="checkbox" />
            <span>Mantener mi sesión iniciada</span>
          </label>
          <SubmitButton>Ingresar a mi cuenta</SubmitButton>
          <p className="auth-form-footer">
            ¿Aún no tienes una cuenta?{" "}
            <Link to="/registro" className="auth-link-gold">
              Regístrate
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}