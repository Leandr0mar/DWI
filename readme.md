# Cremissimo

Aplicación web para presentar el catálogo y la oferta de Cremissimo, una heladería de productos artesanales. El repositorio contiene una API REST desarrollada con Spring Boot y una interfaz web desarrollada con React.

Este README describe la organización y el alcance implementado hasta el **segundo avance del proyecto**. Las entidades y módulos del backend ya contemplan áreas de negocio adicionales; su presencia en el código no implica que todos los flujos de compra, pago y administración estén integrados en la interfaz.

## Distribución del repositorio

```text
DWI/
├── api/       Backend Spring Boot: API REST, seguridad y persistencia
├── ui/        Frontend React: sitio público, catálogo y flujos de usuario
├── db.sql     Script SQL de apoyo para la base de datos y datos de prueba
└── readme.md  Esta documentación
```

Los proyectos `api` y `ui` se ejecutan por separado. En desarrollo local, el frontend usa `http://localhost:8080` como base de la API y Vite suele servir la interfaz en `http://localhost:5173`.

## Tecnologías

### Backend (`api`)

- Java 17 y Spring Boot 4.1.1.
- Spring Web MVC para los endpoints REST.
- Spring Data JPA / Hibernate y MySQL.
- Spring Security con JWT en cookie `HttpOnly` y protección CSRF mediante cookie/token.
- Spring Validation para validar solicitudes.
- Flyway para versionar el esquema y cargar datos iniciales del catálogo.
- Lombok para reducir código repetitivo.
- Maven Wrapper para compilar y ejecutar el proyecto.

### Frontend (`ui`)

- React 19 y TypeScript 6.
- Vite 8 para desarrollo y compilación.
- React Router para navegación.
- TanStack Query para datos remotos y estado de consultas.
- React Hook Form para formularios.
- CSS responsive, React Icons y Lucide React.
- React Compiler mediante Babel y Oxlint.

## Estructura del backend

Ruta base del código Java: `api/src/main/java/com/dwi/api/`.

```text
api/
├── pom.xml
├── mvnw / mvnw.cmd
├── docs/
│   ├── AUTH.md
│   └── MIGRACION_API_ANTIGUA.md
├── legacy/
│   └── api-antiguo/                 Código heredado de referencia
└── src/
    ├── main/
    │   ├── java/com/dwi/api/
    │   │   ├── ApiApplication.java
    │   │   ├── config/              Seguridad y CORS
    │   │   ├── common/
    │   │   │   ├── audit/           Campos base de auditoría
    │   │   │   ├── exception/       Manejo de errores y recurso no encontrado
    │   │   │   └── response/        Respuestas comunes
    │   │   ├── seguridad/
    │   │   │   ├── controller/      Registro, login, sesión y CSRF
    │   │   │   ├── dto/
    │   │   │   ├── jwt/             JWT, filtro y cookie de autenticación
    │   │   │   ├── model/
    │   │   │   └── service/
    │   │   ├── usuario/             Usuario base y repositorio
    │   │   ├── cliente/             Registro, servicio, DTO y entidad Cliente
    │   │   ├── administrador/       Entidad Administrador
    │   │   ├── direccion/           Entidad Direccion
    │   │   ├── zona/                Zonas y estado de pedidos
    │   │   ├── catalogo/
    │   │   │   ├── categoria/       Modelo y repositorio
    │   │   │   ├── producto/        API, servicio, DTO, modelo e historial de stock
    │   │   │   └── sabor/           API, servicio, DTO, modelo y repositorio
    │   │   ├── carrito/             Modelos de carrito y sus detalles
    │   │   ├── pedido/              Modelos de pedido, detalle e historial
    │   │   └── integracion/stripe/  Registro relacionado con webhook de Stripe
    │   └── resources/
    │       ├── application.properties
    │       └── db/migration/           Migraciones Flyway versionadas
    │           ├── V1__create_initial_schema.sql
    │           └── V2__seed_initial_catalog.sql
    └── test/                        Pruebas automatizadas
```

El código de `legacy/api-antiguo` se conserva como referencia de migración. Las entidades actuales están organizadas según los paquetes nuevos; no se deben tratar los modelos heredados como modelos vigentes.

## Estructura del frontend

Ruta base del código de interfaz: `ui/src/`.

```text
ui/
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── App.tsx                     Rutas principales
    ├── main.tsx                    Entrada de React
    ├── App.css / index.css          Estilos globales
    ├── services/
    │   └── auth.ts                 Registro, login, sesión y logout
    ├── pages/
    │   ├── home/                   Inicio, Nosotros y Contactos
    │   ├── productos/              Catálogo y detalle por UUID
    │   ├── auth/                   Login, registro y recuperar contraseña
    │   ├── compra/                 Carrito, checkout y pedido confirmado
    │   ├── cliente/                Configuración de cliente
    │   └── administrador/          Página de administración
    ├── componets/                  Componentes reutilizables (nombre actual)
    │   ├── auth/
    │   ├── common/
    │   │   ├── layout/             Layout y transición entre páginas
    │   │   ├── header/
    │   │   ├── footer/
    │   │   └── carrito_flotante/   Carrito flotante y modal
    │   ├── home/                   Hero, destacados, video y testimonios
    │   ├── contacto/
    │   ├── nosotros/
    │   └── productos/              Hero, filtros y tarjeta de producto
    └── assets/                     Imágenes, logos e iconos
```

La carpeta `componets` aparece escrita así en el proyecto y las importaciones dependen de ese nombre.

## Navegación de la interfaz

| Ruta | Página |
| --- | --- |
| `/` | Redirige a `/inicio` |
| `/inicio` | Página principal |
| `/nosotros` | Información institucional |
| `/contactos` | Información y formulario de contacto |
| `/productos` | Catálogo con filtros |
| `/productos/:uuid` | Detalle del producto seleccionado |
| `/login` | Inicio de sesión |
| `/registro` | Registro de cliente |
| `/recuperar-contrasena` | Solicitud de recuperación de contraseña |

## API disponible

Base local: `http://localhost:8080`.

| Método | Endpoint | Descripción | Acceso |
| --- | --- | --- | --- |
| `GET` | `/api/v1/catalogo/productos` | Lista productos del catálogo | Público |
| `GET` | `/api/v1/catalogo/productos/{uuid}` | Consulta el detalle por UUID | Público |
| `GET` | `/api/v1/catalogo/sabores` | Lista sabores disponibles | Público |
| `GET` | `/api/v1/auth/csrf` | Obtiene el token CSRF para solicitudes protegidas | Público |
| `POST` | `/api/v1/auth/registro` | Registra un cliente | Público |
| `POST` | `/api/v1/auth/login` | Inicia sesión y establece la cookie JWT | Público |
| `GET` | `/api/v1/auth/me` | Devuelve el perfil de la sesión actual | Requiere autenticación |
| `POST` | `/api/v1/auth/logout` | Cierra sesión y elimina la cookie JWT | Requiere autenticación |
| `POST` | `/api/v1/auth/recuperar-password` | Responde de forma genérica a la solicitud | Público; flujo de recuperación pendiente |
| `POST` | `/api/v1/admin/productos` | Crea un producto | Rol ADMIN |
| `PUT` | `/api/v1/admin/productos/{id}` | Actualiza un producto | Rol ADMIN |
| `DELETE` | `/api/v1/admin/productos/{id}` | Elimina un producto | Rol ADMIN |

Los productos exponen, entre otros datos, UUID, SKU, nombre, descripción, precio base, categoría, sabores, imagen, peso/volumen y tipo de presentación. El detalle de los campos de solicitud y respuesta está en los DTO del paquete `catalogo.producto`.

## Funcionalidades y alcance actual

- Sitio público con páginas de inicio, información institucional, contacto y catálogo.
- Catálogo y detalle de producto conectados a los endpoints públicos del backend.
- Filtros de catálogo por categoría, orden de precio, nombre y búsqueda por nombre.
- Registro e inicio de sesión de clientes.
- Autenticación con JWT almacenado en cookie `HttpOnly`; las operaciones de escritura usan CSRF.
- Carrito flotante en la interfaz, con agrupación de productos iguales, modificación de cantidad, eliminación y subtotal.
- Diseño adaptable a escritorio y móvil, transiciones de navegación y elementos visuales del proyecto.

El carrito de la interfaz aún no equivale a un pedido persistido en el backend. Las entidades de pedido, carrito, Stripe y las páginas de compra/administración constituyen estructura de dominio o pantallas en desarrollo; el checkout, el cobro y la administración completa no deben considerarse flujos integrados solo por la existencia de esos archivos.

## Requisitos

- Java 17.
- MySQL compatible con el conector del proyecto.
- Node.js y npm compatibles con la versión de Vite del proyecto.
- PowerShell en Windows (o Bash para usar el wrapper Unix).

## Configuración y ejecución local

### 1. Base de datos y backend

Crea primero el esquema vacío en MySQL:

```sql
CREATE DATABASE cremissimo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Flyway administra el esquema al iniciar la API. En una base vacía ejecuta las migraciones `V1` (tablas) y `V2` (datos iniciales del catálogo); Hibernate usa `validate` para comprobar que las entidades coincidan con el esquema, sin modificarlo.

La conexión se configura en `api/src/main/resources/application.properties`. Para desarrollo local se usan `root` y `root` como valores predeterminados; puedes sobrescribirlos mediante variables de entorno antes de ejecutar la API:

| Variable | Uso | Valor predeterminado local |
| --- | --- | --- |
| `DB_URL` | URL JDBC de MySQL | `jdbc:mysql://localhost:3306/cremissimo?useSSL=false&serverTimezone=UTC` |
| `DB_USERNAME` | Usuario MySQL | `root` |
| `DB_PASSWORD` | Contraseña MySQL | `root` |
| `JPA_SHOW_SQL` | Mostrar SQL de Hibernate | `false` |

En PowerShell, por ejemplo:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "tu-clave-local"
```

`db.sql` se conserva como script manual de referencia para el catálogo. La migración `V2` ya carga esos datos al crear una base nueva; no ejecutes ambos mecanismos sobre la misma base porque los identificadores del catálogo se repetirían.

Si la base ya tenía tablas antes de habilitar Flyway, `baseline-on-migrate` la registra automáticamente en la versión `2` y no vuelve a ejecutar `V1` ni `V2`, preservando sus datos. Luego Hibernate verifica el esquema; si faltan tablas o columnas requeridas, la aplicación fallará al arrancar y habrá que crear una migración correctiva. Haz una copia de seguridad antes de adoptar una base existente.

Desde PowerShell:

```powershell
cd C:\Repositorios\DWI\api
.\mvnw.cmd spring-boot:run
```

En Bash:

```bash
cd api
./mvnw spring-boot:run
```

Para compilar o ejecutar pruebas:

```powershell
.\mvnw.cmd compile
.\mvnw.cmd test
```

La API escucha en `http://localhost:8080` con la configuración local habitual.

### 2. Frontend

En otra terminal:

```powershell
cd C:\Repositorios\DWI\ui
npm install
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

La URL del backend se puede sobrescribir con `VITE_API_URL`. Por ejemplo, crea `ui/.env.local` con:

```dotenv
VITE_API_URL=http://localhost:8080
```

Comandos disponibles en `ui`:

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Comprobación TypeScript y build de producción
npm run lint     # Análisis estático
npm run preview  # Vista local del build
```

## Configuración de autenticación y seguridad

La configuración del backend está en `api/src/main/resources/application.properties`. La cookie de autenticación es `HttpOnly`, por lo que JavaScript del frontend no lee el JWT. Para solicitudes `POST`, el frontend primero solicita CSRF y luego envía el token en `X-XSRF-TOKEN`.

| Variable | Uso | Valor predeterminado local |
| --- | --- | --- |
| `JWT_SECRET` | Secreto para firmar JWT | Vacío; se genera una clave aleatoria al iniciar |
| `JWT_EXPIRATION_MS` | Duración del JWT en milisegundos | `86400000` (24 horas) |
| `AUTH_COOKIE_NAME` | Nombre de la cookie de autenticación | `auth_token` |
| `AUTH_COOKIE_SECURE` | Exige HTTPS para enviar cookies | `false` |
| `AUTH_COOKIE_SAME_SITE` | Política `SameSite` de la cookie | `Lax` |
| `CORS_ALLOWED_ORIGINS` | Orígenes frontend permitidos, separados por comas | `http://localhost:5173,http://127.0.0.1:5173` |

Para una demostración local se puede omitir `JWT_SECRET`; como la clave temporal cambia al reiniciar, las cookies existentes dejan de ser válidas. En un entorno desplegado se debe configurar un secreto estable y privado, habilitar `AUTH_COOKIE_SECURE=true` bajo HTTPS y permitir solo los orígenes reales del frontend. No se debe publicar un secreto JWT ni credenciales reales de base de datos en el repositorio.

El flujo y las notas detalladas de autenticación están en [`api/docs/AUTH.md`](api/docs/AUTH.md).

Flyway está habilitado con validación de migraciones y `clean` deshabilitado para evitar borrar el esquema accidentalmente. Agrega cambios posteriores como nuevos archivos SQL con versiones crecientes en `api/src/main/resources/db/migration/`; no edites migraciones que ya se hayan aplicado en otros entornos.

## Documentación adicional

- [Autenticación y configuración local](api/docs/AUTH.md)
- [Migración desde la API antigua](api/docs/MIGRACION_API_ANTIGUA.md)
