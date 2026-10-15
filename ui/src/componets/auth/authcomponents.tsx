import { useState, forwardRef } from "react";
import type { ReactNode, InputHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import "./authcomponents.css";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string; // Nuevo prop para manejar errores dinámicos
}

interface SuccessMessageProps {
  title: string;
  description: string;
  action: string;
  to: string;
}

const customerPhotos = [
  "photo-1562337404-3044c84ac061",
  "photo-1570712752013-cd1ed598d733",
  "photo-1758523672800-63130c59175b",
];

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.5 19.5 3 12l7.5-7.5M3 12h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {crossed ? (
        <path
          d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.4A10.8 10.8 0 0 1 12 4.2c4.7 0 8.3 3.6 9.5 7.8a12 12 0 0 1-2.2 4.2M6.2 6.2A11.8 11.8 0 0 0 2.5 12c1.2 4.2 4.8 7.8 9.5 7.8 1.4 0 2.7-.3 3.8-.9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : (
        <>
          <path
            d="M2.5 12c1.2-4.2 4.8-7.8 9.5-7.8s8.3 3.6 9.5 7.8c-1.2 4.2-4.8 7.8-9.5 7.8S3.7 16.2 2.5 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-hero-panel" aria-label="Acerca de Cremissimo">
        <div className="auth-orb-top" />
        <div className="auth-orb-bottom" />
        <div className="auth-hero-content">
          <span className="auth-badge">Hecho con ingredientes naturales</span>
          <h2 className="auth-hero-title">Tu próxima cucharada de felicidad te espera.</h2>
          <p className="auth-hero-description">
            Guarda tus sabores favoritos, compra más rápido y comparte tus
            experiencias con nuestra comunidad.
          </p>
        </div>
        <div className="auth-social-proof">
          <div className="auth-avatars" aria-hidden="true">
            {customerPhotos.map((photo) => (
              <img
                key={photo}
                src={`https://images.unsplash.com/${photo}?w=80&h=80&fit=crop&auto=format`}
                alt=""
              />
            ))}
          </div>
          <span>Más de 8.000 clientes felices</span>
        </div>
      </section>

      <section className="auth-form-panel">
        <Link to="/inicio" className="auth-back-link">
          <ArrowLeftIcon />
          Volver al inicio
        </Link>
        <div className="auth-form-container">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1 className="auth-form-title">{title}</h1>
          <p className="auth-form-subtitle">{description}</p>
          <div className="auth-form-content">{children}</div>
        </div>
      </section>
    </main>
  );
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  (
    { id, label, type = "text", placeholder, autoComplete, required = true, inputMode, pattern, minLength, error, ...rest },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="auth-field-container" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
        <label className="auth-field" htmlFor={id} style={{ marginBottom: 0 }}>
          <span className="auth-label">{label}</span>
          <span className="auth-input-wrapper">
            <input
              ref={ref} // Conexión crucial para react-hook-form
              id={id}
              name={id}
              type={isPassword && visible ? "text" : type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              required={required}
              inputMode={inputMode}
              pattern={pattern}
              minLength={minLength}
              className={`auth-input${isPassword ? " auth-input-password" : ""}`}
              {...rest} // Pasa onChange, onBlur, etc.
            />
            {isPassword && (
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <EyeIcon crossed={visible} />
              </button>
            )}
          </span>
        </label>
        {/* Mensaje de error dinámico */}
        {error && (
          <span className="auth-form-error" style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export function SubmitButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button type="submit" className="auth-submit-btn" disabled={disabled}>
      {children}
    </button>
  );
}

export function SuccessMessage({
  title,
  description,
  action,
  to,
}: SuccessMessageProps) {
  return (
    <div className="auth-success">
      <div className="auth-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="m4.5 12.75 4.5 4.5 10.5-10.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <h2 className="auth-success-title">{title}</h2>
      <p className="auth-success-description">{description}</p>
      <Link to={to} className="auth-success-action">
        {action}
      </Link>
    </div>
  );
}
