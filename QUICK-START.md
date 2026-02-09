# 🚀 Quick Start Guide

Guía rápida para poner en marcha el API de Gestión de Transporte en menos de 5 minutos.

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Configurar Variables de Entorno

El archivo `.env` ya está creado con los valores por defecto. Si necesitas modificarlo:

```bash
# .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/transport-db
NODE_ENV=development
```

## Paso 3: Iniciar MongoDB

Elige una de las siguientes opciones:

### Opción A: MongoDB Local (macOS con Homebrew)
```bash
brew services start mongodb-community
```

### Opción B: MongoDB Local (Linux)
```bash
sudo systemctl start mongod
```

### Opción C: Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Opción D: MongoDB Atlas (Cloud)
Actualiza `MONGODB_URI` en `.env` con tu connection string de Atlas.

## Paso 4: Ejecutar Tests (Opcional pero Recomendado)

```bash
npm test
```

Deberías ver:
```
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

## Paso 5: Iniciar el Servidor

### Modo Desarrollo (con hot-reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm run build
npm start
```

## Paso 6: Probar el API

### Health Check
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{"status":"ok","message":"API de Transporte funcionando correctamente"}
```

### Crear un Conductor
```bash
curl -X POST http://localhost:3000/api/conductores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "licencia": "ABC123456",
    "telefono": "+34612345678",
    "email": "juan.perez@example.com",
    "fechaNacimiento": "1985-05-15"
  }'
```

### Listar Conductores
```bash
curl http://localhost:3000/api/conductores
```

## 🎉 ¡Listo!

Tu API está corriendo en `http://localhost:3000`

## 📚 Próximos Pasos

1. Lee el [README.md](./README.md) para documentación completa
2. Revisa [API-EXAMPLES.md](./API-EXAMPLES.md) para ver todos los endpoints
3. Consulta [RESUMEN.md](./RESUMEN.md) para un overview técnico

## 🐛 Solución de Problemas

### Error: "Database not connected"
- Asegúrate de que MongoDB está corriendo
- Verifica que `MONGODB_URI` en `.env` es correcto

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env` a otro valor (ej: 3001)
- O detén el proceso que está usando el puerto 3000

### Error al instalar dependencias
```bash
# Limpia la caché de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estructura de Archivos Principales

```
node-api-example/
├── src/
│   ├── domain/              # Lógica de negocio
│   ├── application/         # Casos de uso
│   ├── infrastructure/      # MongoDB
│   ├── api/                 # Express REST API
│   └── __tests__/           # Tests de integración
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env                     # Configuración
├── README.md                # Documentación completa
├── RESUMEN.md              # Resumen técnico
├── API-EXAMPLES.md         # Ejemplos de API
└── QUICK-START.md          # Esta guía
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Solo tests de integración
npm run test:integration

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

## 📝 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/conductores` | Crear conductor |
| GET | `/api/conductores` | Listar conductores |
| GET | `/api/conductores/:id` | Obtener por ID |
| PUT | `/api/conductores/:id` | Actualizar |
| DELETE | `/api/conductores/:id` | Eliminar |

## ✅ Checklist de Verificación

- [ ] Node.js instalado (v18+)
- [ ] MongoDB corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] Tests pasando (`npm test`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Health check respondiendo
- [ ] CRUD funcionando correctamente

---

**¿Problemas?** Revisa la sección de troubleshooting o consulta la documentación completa en [README.md](./README.md)
