# Autenticación con JWT Bearer

## Flujo

- `POST /api/v1/auth/registro` registra la cuenta y almacena la contraseña con BCrypt.
- `POST /api/v1/auth/login` recibe `email` y `password`; devuelve el JWT junto con `nombreCompleto`, `rol` y `avatarUrl`.
- El frontend guarda el JWT en `localStorage` bajo la clave `authToken` y lo envía en las rutas protegidas como `Authorization: Bearer <token>`.
- `GET /api/v1/auth/me` devuelve el perfil correspondiente al token.
- Para cerrar sesión, el frontend elimina el token de `localStorage`.

La API es stateless: el servidor valida la firma y vigencia del token en cada solicitud. Las contraseñas se almacenan con BCrypt. Como un token en `localStorage` es accesible desde JavaScript, un XSS podría robarlo; mantén React actualizado, evita renderizar HTML no confiable y aplica una política CSP adecuada.

## Configuración

`JWT_SECRET` es opcional para facilitar la ejecución en el laboratorio. Si no está configurado, la API genera una clave aleatoria al arrancar. En ese caso, los JWT existentes dejan de ser válidos cada vez que se reinicia la API. Para conservar sesiones entre reinicios o ejecutar varias instancias, configura el mismo `JWT_SECRET` Base64 (al menos 32 bytes) en todas ellas:

```powershell
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
.\mvnw.cmd spring-boot:run
```

La URL base de la API en React se configura con `VITE_API_URL`; por defecto es `http://localhost:8080`.
