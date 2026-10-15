# Cremissimo

Plataforma web para la elaboracion y comercializacion de helados tradicionales y artesanales en Lima, Peru. El proyecto integra una interfaz de comercio electronico para clientes con una API REST orientada a la gestion del catalogo, sabores, usuarios e inventario.

## Contexto del negocio

Cremissimo busca ampliar su alcance en el mercado local mediante una experiencia digital para la venta y entrega de helados artesanales a domicilio.

La plataforma contempla dos actores principales:

- **Cliente:** consulta el catalogo de helados y sabores, agrega productos al carrito, revisa el total de su compra y puede continuar con futuros flujos de pedido, pago y entrega.
- **Administrador:** gestiona la informacion operativa del negocio, incluyendo productos, sabores, precios, inventario, despachos, ventas y reseñas.

El alcance descrito para el producto incluye metodos de pago, direcciones de entrega dentro de Lima, seguimiento de despachos, historial de ventas y moderacion de comentarios. Algunas de estas capacidades forman parte del objetivo funcional y pueden requerir implementacion adicional sobre la base actual.

## Arquitectura

El proyecto esta organizado en dos aplicaciones independientes:

```text
DWI/
|-- api/   API REST y persistencia
|-- ui/    Aplicacion web para clientes
|-- db.sql Script inicial de datos para MySQL
```

El frontend consume la API mediante HTTP. El backend utiliza Spring Data JPA para consultar MySQL y expone recursos relacionados con helados y sabores.

## Tecnologias utilizadas

### Frontend (`ui`)

- **React 19** para la construccion de la interfaz.
- **TypeScript 6** para tipado estatico.
- **Vite 8** como servidor de desarrollo y herramienta de build.
- **TanStack Query 5** para peticiones, cache y estados de carga/error del catalogo.
- **React Icons** para iconos de redes sociales y elementos de interfaz.
- **CSS** para estilos responsive de header, hero, catalogo, carrito, video, testimonios y footer.
- **React Compiler** mediante Babel para optimizacion del codigo React.
- **Oxlint** para validacion de codigo.

### Backend (`api`)

- **Java 17**.
- **Spring Boot 4.1.1**.
- **Spring Web MVC** para la API REST.
- **Spring Data JPA** para repositorios y persistencia.
- **Hibernate ORM** como implementacion JPA.
- **Spring Security** para autenticacion y autorizacion de rutas.
- **Spring Validation** para validacion de datos.
- **MySQL 8** como base de datos relacional.
- **MySQL Connector/J** como driver JDBC.
- **Lombok** para reducir codigo repetitivo en entidades y modelos.
- **Spring Boot DevTools** para facilitar el desarrollo local.
- **Maven Wrapper** para compilar y ejecutar el backend sin requerir una instalacion global de Maven.

## Funcionalidades actuales

### Interfaz web

- Header responsive con navegacion hacia las secciones principales.
- Hero con slider automatico de imagenes de helados.
- Catalogo de productos obtenido desde el backend.
- Tarjetas de producto con nombre, sabores, precio e imagen.
- Carrito de compras en memoria del navegador.
- Modal de carrito con productos agregados y total.
- Secciones de informacion institucional, video, testimonios, redes sociales y empresas afiliadas.
- Diseno responsive para escritorio y dispositivos moviles.

### API

Actualmente se encuentran implementados estos endpoints de consulta:

| Metodo | Ruta | Descripcion | Acceso |
| --- | --- | --- | --- |
| `GET` | `/api/helados/listar` | Lista todos los helados | Publico |
| `GET` | `/api/sabores` | Lista los sabores activos | Protegido por defecto |

La API cuenta con entidades y capas para helados, sabores y usuarios, ademas de roles de cliente y administrador. La configuracion de seguridad permite CORS desde `http://localhost:5173`, deshabilita CSRF para el escenario actual de API y protege las rutas no declaradas publicas.

## Requisitos previos

- Node.js y npm.
- Java 17.
- MySQL 8 o compatible.
- MySQL ejecutandose localmente.

## Configuracion de la base de datos

Crea la base de datos `cremissimo` y configura las credenciales en:

`api/src/main/resources/application.properties`

Configuracion actual de referencia:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cremissimo?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

El archivo [db.sql](db.sql) contiene la creacion de la base de datos y datos iniciales para sabores y helados. Las tablas pueden ser creadas por Hibernate al iniciar la aplicacion cuando `spring.jpa.hibernate.ddl-auto=update` esta habilitado.

## Ejecucion local

### Backend

Desde la carpeta `api`:

```bash
./mvnw spring-boot:run
```

En Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

Para ejecutar las pruebas:

```powershell
.\mvnw.cmd test
```

### Frontend

Desde la carpeta `ui`:

```bash
npm install
npm run dev
```

La aplicacion queda disponible normalmente en `http://localhost:5173`.

Comandos disponibles:

```bash
npm run build   # Verificacion TypeScript y build de produccion
npm run lint    # Analisis estatico con Oxlint
npm run preview # Servir el build localmente
```

## Variables y configuracion importante

La URL del backend se encuentra actualmente definida en el componente de productos:

```text
http://localhost:8080/api/helados/listar
```

Para desplegar el proyecto en otro entorno, conviene trasladar esta URL a una variable de entorno de Vite, por ejemplo `VITE_API_URL`, y configurar tambien el origen permitido en Spring Security.

## Estructura principal

```text
api/src/main/java/com/dwi/api/
|-- config/                 Configuracion de seguridad y CORS
|-- helado/                 Entidad, controlador, servicio y repositorio
|   |-- enums/              Estados y tipos de presentacion
|   `-- sabor/              Entidad, controlador y repositorio de sabores
|-- usuario/                Entidad, servicio y repositorio de usuarios
|   |-- administrador/      Modelo de administrador
|   |-- cliente/            Modelo de cliente y direccion
|   `-- rol/                Modelo de roles
`-- ApiApplication.java     Punto de entrada de Spring Boot

ui/src/
|-- App.tsx                 Composicion principal y estado del carrito
|-- componets/header/       Navegacion y acciones del header
|-- componets/hero/         Hero y slider de imagenes
|-- componets/productos/    Consulta y tarjetas del catalogo
|-- componets/carrito/      Modal del carrito
|-- componets/nosotros/     Informacion institucional
|-- componets/testimonios/  Testimonios
`-- componets/footer/       Pie de pagina y enlaces institucionales
```

## Roadmap funcional

Para completar el alcance de comercio electronico planteado para Cremissimo, las siguientes capacidades pueden implementarse sobre la base actual:

- Autenticacion y registro de clientes y administradores.
- CRUD administrativo para helados, sabores, precios e inventario.
- Persistencia de carritos y ordenes.
- Integracion de metodos de pago.
- Gestion de direcciones y zonas de entrega en Lima.
- Seguimiento del estado de los despachos.
- Historial de ventas y dashboard administrativo.
- Registro y moderacion de reseñas.
- Separacion de configuracion por entornos y variables seguras para credenciales.

## Estado del proyecto

El proyecto se encuentra en desarrollo. La integracion base entre el frontend React, la API Spring Boot y MySQL esta operativa para la consulta del catalogo y la carga inicial de productos.