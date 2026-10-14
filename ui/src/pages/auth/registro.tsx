import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AuthShell, Field, SubmitButton, SuccessMessage } from "../../componets/auth/authcomponents";
import { registrarCliente } from "../../services/auth";

export default function Registro() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const registration = useMutation({
    mutationFn: registrarCliente,
    onSuccess: (response) => {
      setSuccessMessage(response.mensaje);
      setSubmitted(true);
    },
    onError: (error: Error) => setFormError(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("register-password") ?? "");
    const passwordConfirmation = formData.get("confirm-password");

    if (password !== passwordConfirmation) {
      setFormError("Las contraseñas no coinciden. Verifica la información e inténtalo nuevamente.");
      return;
    }

    setFormError("");
    registration.mutate({
      nombres: String(formData.get("first-name") ?? ""),
      apellidos: String(formData.get("last-name") ?? ""),
      email: String(formData.get("register-email") ?? ""),
      dni: String(formData.get("dni") ?? ""),
      telefono: String(formData.get("phone") ?? ""),
      password,
    });
  }

  return (
    <AuthShell
      eyebrow="Únete a Cremissimo"
      title="Crea tu cuenta"
      description="Haz tus pedidos más rápido y descubre beneficios preparados para ti."
    >
      {submitted ? (
        <SuccessMessage
          title="Cuenta lista para crear"
          description={successMessage}
          action="Ir a iniciar sesión"
          to="/login"
        />
      ) : (
        <form className="auth-form auth-form-register" onSubmit={handleSubmit}>
          <div className="auth-form-grid">
            <Field id="first-name" label="Nombres" placeholder="Valentina María" autoComplete="given-name" />
            <Field id="last-name" label="Apellidos" placeholder="Rojas López" autoComplete="family-name" />
          </div>
          <Field id="register-email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" autoComplete="email" />
          <div className="auth-form-grid">
            <Field
              id="dni"
              label="DNI"
              placeholder="Ingresa tu documento"
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]{8}"
            />
            <Field
              id="phone"
              label="Teléfono"
              type="tel"
              placeholder="987 654 321"
              autoComplete="tel"
              inputMode="tel"
              pattern="9[0-9]{8}"
            />
          </div>
          <div className="auth-form-grid">
            <Field
              id="register-password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              minLength={8}
            />
            <Field
              id="confirm-password"
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          {formError && (
            <p role="alert" className="auth-form-error">
              {formError}
            </p>
          )}
          <label className="auth-checkbox-label auth-checkbox-register">
            <input type="checkbox" required />
            <span>
              Acepto los <a href="#terminos" className="auth-link">términos y condiciones</a> y la política de privacidad.
            </span>
          </label>
          <SubmitButton disabled={registration.isPending}>
            {registration.isPending ? "Creando cuenta…" : "Crear mi cuenta"}
          </SubmitButton>
          <p className="auth-form-footer">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="auth-link-gold">
              Inicia sesión
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
