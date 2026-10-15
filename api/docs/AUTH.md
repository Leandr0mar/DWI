# Autenticación con cookie HttpOnly

## Flujo

- `GET /api/v1/auth/csrf` entrega al frontend el token CSRF para solicitudes que cambian estado.
- `POST /api/v1/auth/registro` crea la cuenta y almacena la contraseña con BCrypt.
- `POST /api/v1/auth/login` valida email y contraseña y establece el JWT en una cookie `HttpOnly`. El JSON solo contiene el perfil (`nombreCompleto`, `rol`, `avatarUrl`).
- `GET /api/v1/auth/me` devuelve el perfil de la sesión autenticada.
- `POST /api/v1/auth/logout` invalida la cookie de autenticación.

El frontend envía cookies con `credentials: include` y añade el token CSRF recibido en `X-XSRF-TOKEN` para las solicitudes `POST`. Ni el JWT ni el token CSRF se guardan en `localStorage`.

## Presentación local

No es necesario definir `JWT_SECRET` para iniciar en el laboratorio. Cuando falta, la aplicación genera una clave aleatoria al arrancar. Las sesiones activas se invalidan al reiniciar el backend, lo cual es esperado para esta presentación. La cookie de autenticación usa `HttpOnly`, `SameSite=Lax` y `Secure=false` por defecto para desarrollo local.

Arranca el API desde `C:\Repositorios\DWI\api` con `.\mvnw.cmd spring-boot:run`; el UI usa `http://localhost:8080` por defecto. Si los puertos/orígenes son distintos, permite explícitamente el origen del frontend con `CORS_ALLOWED_ORIGINS`.

Para producción, configura un `JWT_SECRET` estable y privado, `AUTH_COOKIE_SECURE=true`, HTTPS y los orígenes exactos en `CORS_ALLOWED_ORIGINS`. `SameSite=None` requiere cookies `Secure`.
