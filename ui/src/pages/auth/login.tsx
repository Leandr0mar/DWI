import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, Field, SubmitButton } from "../../componets/auth/authcomponents";
import { AUTH_USER_QUERY_KEY, iniciarSesion } from "../../services/auth";

export default function Login() {
  const [formError, setFormError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const login = useMutation({
    mutationFn: iniciarSesion,
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, response);
      navigate("/inicio", { replace: true });
    },
    onError: (error: Error) => setFormError(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError("");
    login.mutate({
      email: String(formData.get("login-email") ?? ""),
      password: String(formData.get("login-password") ?? ""),
    });
  }

  return (
    <AuthShell
      eyebrow="Bienvenido de nuevo"
      title="Inicia sesión"
      description="Accede a tu cuenta para continuar disfrutando tus sabores favoritos."
    >
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
          {formError && <p role="alert" className="auth-form-error">{formError}</p>}
          <SubmitButton disabled={login.isPending}>
            {login.isPending ? "Ingresando…" : "Ingresar a mi cuenta"}
          </SubmitButton>
          <p className="auth-form-footer">
            ¿Aún no tienes una cuenta?{" "}
            <Link to="/registro" className="auth-link-gold">
              Regístrate
            </Link>
          </p>
      </form>
    </AuthShell>
  );
}
