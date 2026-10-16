import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthShell, Field, SubmitButton, SuccessMessage } from "../../componets/auth/authcomponents";
import { registrarCliente } from "../../services/auth";

// Reglas de validación dinámicas
const validacionPassword = {
  minLength: (value: string) => value.length >= 8,
  hasUpperCase: (value: string) => /[A-Z]/.test(value),
  hasLowerCase: (value: string) => /[a-z]/.test(value),
  hasNumber: (value: string) => /[0-9]/.test(value),
  hasSpecial: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
};

export default function Registro() {
  const [submitted, setSubmitted] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = watch("register-password", "");

  const registration = useMutation({
    mutationFn: registrarCliente,
    onSuccess: (response) => {
      setSuccessMessage(response.mensaje);
      setSubmitted(true);
    },
  });

  const onSubmit = (data: any) => {
    registration.mutate({
      nombres: data["first-name"].trim(),
      apellidos: data["last-name"].trim(),
      email: data["register-email"].trim().toLowerCase(),
      dni: data["dni"].trim(),
      telefono: data["phone"].trim(),
      password: data["register-password"],
    });
  };

  const PasswordStrengthIndicator = () => {
    const checks = [
      { label: "Mínimo 8 caracteres", valid: validacionPassword.minLength(password) },
      { label: "Una mayúscula", valid: validacionPassword.hasUpperCase(password) },
      { label: "Una minúscula", valid: validacionPassword.hasLowerCase(password) },
      { label: "Al menos un número", valid: validacionPassword.hasNumber(password) },
      { label: "Un carácter especial (@, #, etc.)", valid: validacionPassword.hasSpecial(password) },
    ];

    const strength = checks.filter((c) => c.valid).length;

    return (
      <div style={{ marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.75rem" }}>
          <span style={{ fontWeight: 500, color: "#4b5563" }}>Seguridad de la contraseña</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                style={{
                  width: "20px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: level <= strength 
                    ? strength <= 2 ? "#ef4444" : strength <= 3 ? "#f59e0b" : "#10b981" 
                    : "#d1d5db"
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
          {checks.map((check, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem" }}>
              {check.valid ? (
                <CheckCircle2 size={12} color="#10b981" />
              ) : (
                <AlertCircle size={12} color="#9ca3af" />
              )}
              <span style={{ color: check.valid ? "#059669" : "#6b7280" }}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        <form className="auth-form auth-form-register" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-form-grid">
            <Field 
              id="first-name" 
              label="Nombres" 
              placeholder="Valentina María" 
              autoComplete="given-name"
              error={errors["first-name"]?.message as string}
              {...register("first-name", {
                required: "Tus nombres son obligatorios",
                pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo se permiten letras" }
              })}
            />
            <Field 
              id="last-name" 
              label="Apellidos" 
              placeholder="Rojas López" 
              autoComplete="family-name"
              error={errors["last-name"]?.message as string}
              {...register("last-name", {
                required: "Tus apellidos son obligatorios",
                pattern: { value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: "Solo se permiten letras" }
              })}
            />
          </div>
          
          <Field 
            id="register-email" 
            label="Correo electrónico" 
            type="email" 
            placeholder="nombre@correo.com" 
            autoComplete="email"
            error={errors["register-email"]?.message as string}
            {...register("register-email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Formato de correo inválido"
              }
            })}
          />
          
          <div className="auth-form-grid">
            <Field
              id="dni"
              label="DNI"
              placeholder="12345678"
              autoComplete="off"
              inputMode="numeric"
              maxLength={8}
              error={errors["dni"]?.message as string}
              {...register("dni", {
                required: "El DNI es obligatorio",
                pattern: { value: /^\d{8}$/, message: "Debe tener 8 dígitos exactos" }
              })}
            />
            <Field
              id="phone"
              label="Teléfono"
              type="tel"
              placeholder="987654321"
              autoComplete="tel"
              inputMode="tel"
              maxLength={9}
              error={errors["phone"]?.message as string}
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: { value: /^9\d{8}$/, message: "Debe empezar con 9 y tener 9 dígitos" }
              })}
            />
          </div>
          
          <div className="auth-password-fields">
            <div style={{ width: "100%" }}>
              <Field
                id="register-password"
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                error={errors["register-password"]?.message as string}
                {...register("register-password", {
                  required: "Ingresa una contraseña",
                  validate: {
                    minLength: (v) => validacionPassword.minLength(v) || "Mínimo 8 caracteres",
                    hasUpper: (v) => validacionPassword.hasUpperCase(v) || "Falta una mayúscula",
                    hasLower: (v) => validacionPassword.hasLowerCase(v) || "Falta una minúscula",
                    hasNumber: (v) => validacionPassword.hasNumber(v) || "Falta un número",
                    hasSpecial: (v) => validacionPassword.hasSpecial(v) || "Falta un símbolo especial",
                  },
                  onBlur: () => setPasswordFocus(false)
                })}
                onFocus={() => setPasswordFocus(true)}
              />
              {passwordFocus && <PasswordStrengthIndicator />}
            </div>

            <div style={{ width: "100%" }}>
              <Field
                id="confirm-password"
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                error={errors["confirm-password"]?.message as string}
                {...register("confirm-password", {
                  required: "Confirma tu contraseña",
                  validate: (value) => value === password || "Las contraseñas no coinciden",
                })}
              />
            </div>
          </div>
          
          {registration.isError && (
            <p role="alert" className="auth-form-error" style={{ color: "#ef4444", textAlign: "center" }}>
              {registration.error.message || "Ocurrió un error en el registro."}
            </p>
          )}

          <label className="auth-checkbox-label auth-checkbox-register">
            <input 
              type="checkbox" 
              {...register("aceptaTerminos", { required: true })} 
            />
            <span>
              Acepto los <a href="#terminos" className="auth-link">términos y condiciones</a> y la política de privacidad.
            </span>
          </label>
          {errors["aceptaTerminos"] && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "-0.5rem" }}>Debes aceptar los términos.</p>
          )}

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
