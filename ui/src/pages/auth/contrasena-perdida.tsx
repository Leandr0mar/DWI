import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthShell, Field, SubmitButton, SuccessMessage } from "../../componets/auth/authcomponents";

export default function ContrasenaPerdida() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AuthShell
      eyebrow="Recupera tu acceso"
      title="¿Olvidaste tu contraseña?"
      description="Escribe el correo asociado a tu cuenta y te enviaremos instrucciones para crear una nueva."
    >
      {submitted ? (
        <SuccessMessage
          title="Revisa tu correo"
          description="Si existe una cuenta asociada, recibirás un enlace de recuperación en los próximos minutos."
          action="Volver a iniciar sesión"
          to="/login"
        />
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field id="recovery-email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email" />
          <SubmitButton>Enviar enlace de recuperación</SubmitButton>
          <p className="auth-form-footer">
            ¿Recordaste tu contraseña?{" "}
            <Link to="/login" className="auth-link-gold">
              Volver a ingresar
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}