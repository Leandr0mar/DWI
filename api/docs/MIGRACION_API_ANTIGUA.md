# Migración de `api antiguo`

La configuración de seguridad y CORS se trasladó a `config/` y se conserva la protección CSRF/cookie del proyecto actual. El antiguo `ApiExceptionHandler` se integró en `common/exception/GlobalExceptionHandler`.

La lógica de catálogo fue adaptada a `Producto`, `Categoria` y `Sabor`; no se copiaron las entidades `Helado` y `Sabor` antiguas. Endpoints agregados:

- `GET /api/v1/catalogo/productos` y `GET /api/v1/catalogo/productos/{uuid}`: lectura pública mediante DTOs; el detalle se busca por UUID público, no por ID interno.
- `GET /api/v1/catalogo/sabores`: lista sabores disponibles.
- `POST`, `PUT` y `DELETE /api/v1/admin/productos[/{id}]`: administración protegida por rol y CSRF.

Los controladores de clientes y administradores antiguos aceptaban y devolvían entidades directamente, lo que podía exponer hashes de contraseña y otros campos internos. No se migraron; el registro actual sigue usando DTO y la entidad `Usuario` nueva. `WebConfig.java` estaba vacío y no requería migración.

Los fuentes antiguos se conservaron en `legacy/api-antiguo/`, fuera de `src/main/java`, para que no se compilen junto a los modelos nuevos ni generen clases duplicadas.
