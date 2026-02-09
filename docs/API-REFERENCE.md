# Ejemplos de Respuestas del API

Este documento muestra ejemplos reales de las respuestas del API para cada endpoint.

## Health Check

### Request
```http
GET /health HTTP/1.1
Host: localhost:3000
```

### Response (200 OK)
```json
{
  "status": "ok",
  "message": "API de Transporte funcionando correctamente"
}
```

---

## Crear Conductor

### Request
```http
POST /api/conductores HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "licencia": "ABC123456",
  "telefono": "+34612345678",
  "email": "juan.perez@example.com",
  "fechaNacimiento": "1985-05-15"
}
```

### Response Exitosa (201 Created)
```json
{
  "id": "019c3cfe-7d80-7aa5-bd2f-14f324183ad1",
  "nombre": "Juan",
  "apellido": "Pérez",
  "licencia": "ABC123456",
  "telefono": "+34612345678",
  "email": "juan.perez@example.com",
  "fechaNacimiento": "1985-05-15T00:00:00.000Z",
  "activo": true,
  "fechaCreacion": "2024-02-07T12:00:00.000Z",
  "fechaActualizacion": "2024-02-07T12:00:00.000Z"
}
```

### Response Error - Campos Faltantes (400 Bad Request)
```json
{
  "error": "Todos los campos son requeridos",
  "campos": [
    "nombre",
    "apellido",
    "licencia",
    "telefono",
    "email",
    "fechaNacimiento"
  ]
}
```

### Response Error - Email Inválido (400 Bad Request)
```json
{
  "error": "El email no es válido"
}
```

### Response Error - Licencia Duplicada (400 Bad Request)
```json
{
  "error": "Ya existe un conductor con esta licencia"
}
```

---

## Obtener Todos los Conductores

### Request
```http
GET /api/conductores HTTP/1.1
Host: localhost:3000
```

### Response - Con Datos (200 OK)
```json
[
  {
    "id": "019c3cfe-7d80-7aa5-bd2f-14f324183ad1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "licencia": "ABC123456",
    "telefono": "+34612345678",
    "email": "juan.perez@example.com",
    "fechaNacimiento": "1985-05-15T00:00:00.000Z",
    "activo": true,
    "fechaCreacion": "2024-02-07T12:00:00.000Z",
    "fechaActualizacion": "2024-02-07T12:00:00.000Z"
  },
  {
    "id": "019c3d01-8b92-7cc3-a456-89abc0123def",
    "nombre": "María",
    "apellido": "García",
    "licencia": "DEF789012",
    "telefono": "+34698765432",
    "email": "maria.garcia@example.com",
    "fechaNacimiento": "1990-08-20T00:00:00.000Z",
    "activo": true,
    "fechaCreacion": "2024-02-07T12:01:00.000Z",
    "fechaActualizacion": "2024-02-07T12:01:00.000Z"
  }
]
```

### Response - Sin Datos (200 OK)
```json
[]
```

---

## Obtener Conductor por ID

### Request
```http
GET /api/conductores/019c3cfe-7d80-7aa5-bd2f-14f324183ad1 HTTP/1.1
Host: localhost:3000
```

### Response Exitosa (200 OK)
```json
{
  "id": "019c3cfe-7d80-7aa5-bd2f-14f324183ad1",
  "nombre": "Juan",
  "apellido": "Pérez",
  "licencia": "ABC123456",
  "telefono": "+34612345678",
  "email": "juan.perez@example.com",
  "fechaNacimiento": "1985-05-15T00:00:00.000Z",
  "activo": true,
  "fechaCreacion": "2024-02-07T12:00:00.000Z",
  "fechaActualizacion": "2024-02-07T12:00:00.000Z"
}
```

### Response Error - No Encontrado (404 Not Found)
```json
{
  "error": "Conductor no encontrado"
}
```

---

## Actualizar Conductor

### Request - Actualización Parcial
```http
PUT /api/conductores/019c3cfe-7d80-7aa5-bd2f-14f324183ad1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "telefono": "+34611111111"
}
```

### Response Exitosa (200 OK)
```json
{
  "id": "019c3cfe-7d80-7aa5-bd2f-14f324183ad1",
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "licencia": "ABC123456",
  "telefono": "+34611111111",
  "email": "juan.perez@example.com",
  "fechaNacimiento": "1985-05-15T00:00:00.000Z",
  "activo": true,
  "fechaCreacion": "2024-02-07T12:00:00.000Z",
  "fechaActualizacion": "2024-02-07T12:05:00.000Z"
}
```

### Request - Desactivar Conductor
```http
PUT /api/conductores/019c3cfe-7d80-7aa5-bd2f-14f324183ad1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "activo": false
}
```

### Response Exitosa (200 OK)
```json
{
  "id": "019c3cfe-7d80-7aa5-bd2f-14f324183ad1",
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "licencia": "ABC123456",
  "telefono": "+34611111111",
  "email": "juan.perez@example.com",
  "fechaNacimiento": "1985-05-15T00:00:00.000Z",
  "activo": false,
  "fechaCreacion": "2024-02-07T12:00:00.000Z",
  "fechaActualizacion": "2024-02-07T12:06:00.000Z"
}
```

### Response Error - No Encontrado (404 Not Found)
```json
{
  "error": "Conductor no encontrado"
}
```

### Response Error - Email Inválido (400 Bad Request)
```json
{
  "error": "El email no es válido"
}
```

### Response Error - Licencia Duplicada (400 Bad Request)
```json
{
  "error": "Ya existe otro conductor con esta licencia"
}
```

---

## Eliminar Conductor

### Request
```http
DELETE /api/conductores/019c3cfe-7d80-7aa5-bd2f-14f324183ad1 HTTP/1.1
Host: localhost:3000
```

### Response Exitosa (204 No Content)
```
(Sin contenido)
```

### Response Error - No Encontrado (404 Not Found)
```json
{
  "error": "Conductor no encontrado"
}
```

---

## Ruta No Encontrada

### Request
```http
GET /api/ruta-inexistente HTTP/1.1
Host: localhost:3000
```

### Response (404 Not Found)
```json
{
  "error": "Ruta no encontrada"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET exitoso (obtener uno o varios) |
| 201 | Created | POST exitoso (crear conductor) |
| 204 | No Content | DELETE exitoso |
| 400 | Bad Request | Datos inválidos o faltantes |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

---

## Validaciones por Campo

### nombre
- ✅ Requerido
- ✅ No puede estar vacío
- ✅ Debe ser string

### apellido
- ✅ Requerido
- ✅ No puede estar vacío
- ✅ Debe ser string

### licencia
- ✅ Requerido
- ✅ No puede estar vacío
- ✅ Debe ser único en el sistema
- ✅ Debe ser string

### telefono
- ✅ Requerido
- ✅ No puede estar vacío
- ✅ Debe ser string

### email
- ✅ Requerido
- ✅ Debe tener formato válido (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- ✅ Debe ser string

### fechaNacimiento
- ✅ Requerido
- ✅ Debe ser una fecha válida
- ✅ Formato: ISO 8601 (`YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ss.sssZ`)

### activo
- ⚪ Opcional
- ✅ Default: `true`
- ✅ Debe ser boolean

---

## Notas Importantes

1. **Formato de Fechas**: Todas las fechas se manejan en formato ISO 8601.

2. **IDs Únicos**: Los IDs se generan automáticamente en formato: `{timestamp}-{random}`.

3. **Timestamps Automáticos**: `fechaCreacion` y `fechaActualizacion` se manejan automáticamente.

4. **Validación en Cascada**: 
   - Las validaciones ocurren en la capa de dominio
   - Los errores se capturan en el controlador
   - Se devuelven respuestas HTTP apropiadas

5. **Unicidad de Licencia**: El sistema garantiza que no pueden existir dos conductores con el mismo número de licencia.

6. **Actualizaciones Parciales**: El endpoint PUT permite actualizar solo los campos que se envíen, manteniendo el resto sin cambios.
