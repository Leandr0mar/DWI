import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell, Field, SubmitButton } from "../../componets/auth/authcomponents";
import { AUTH_USER_QUERY_KEY, iniciarSesion } from "../../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useMutation({
    mutationFn: iniciarSesion,
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, response);
      const returnTo = (location.state as { from?: unknown } | null)?.from;
      navigate(
        response.rolSistema === "ADMIN"
          ? "/administrador/dashboard"
          : returnTo === "/checkout" ? "/checkout" : "/inicio",
        { replace: true },
      );
    },
    onError: (error: Error) => setFormError(error.message),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    login.mutate({ email, password });
  }

  function populateDemoCredentials(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("Cremissimo123!");
    setFormError("");
  }

  return (
    <AuthShell
      eyebrow="Bienvenido de nuevo"
      title="Inicia sesión"
      description="Accede a tu cuenta para continuar disfrutando tus sabores favoritos."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <Field
          id="login-email"
          label="Correo electrónico"
          type="email"
          placeholder="nombre@correo.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="auth-field">
          <Field
            id="login-password"
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
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
        <div className="auth-demo-access">
          <span className="auth-demo-label">Acceso rápido</span>
          <div className="auth-demo-buttons">
            <button
              type="button"
              className="auth-demo-button"
              disabled={login.isPending}
              onClick={() => populateDemoCredentials("admin@cremissimo.test")}
            >
              Usar cuenta de administrador
            </button>
            <button
              type="button"
              className="auth-demo-button"
              disabled={login.isPending}
              onClick={() => populateDemoCredentials("ana.garcia@cremissimo.test")}
            >
              Usar cuenta de usuario
            </button>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
