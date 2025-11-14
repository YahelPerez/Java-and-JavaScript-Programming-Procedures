# Graph API - Express.js

## Descripción
API REST desarrollada en Express.js para gestionar ciudades, distancias y operaciones de grafos como parte del sistema de reservas y visualización de grafos.

## Características Implementadas ✅

### Modelos de Datos
- **City.js** - Modelo completo para gestión de ciudades
- **Distance.js** - Modelo completo para gestión de distancias entre ciudades

### Controladores
- **CityController.js** - Controlador REST para operaciones CRUD de ciudades
- **DistanceController.js** - Controlador REST para operaciones CRUD de distancias

### Rutas
- **cityRoutes.js** - Rutas RESTful para ciudades
- **distanceRoutes.js** - Rutas RESTful para distancias
- **graphRoutes.js** - Rutas especializadas para operaciones de grafos

### Servidor Principal
- **server.js** - Servidor Express con middleware de seguridad completo

## Arquitectura

```
backend/graph-api/
├── server.js              # Servidor principal Express
├── src/
│   ├── config/
│   │   └── database.js     # Configuración MySQL
│   ├── models/
│   │   ├── City.js         # Modelo de ciudades
│   │   └── Distance.js     # Modelo de distancias
│   ├── controllers/
│   │   ├── CityController.js     # Controlador de ciudades
│   │   └── DistanceController.js # Controlador de distancias
│   └── routes/
│       ├── cityRoutes.js         # Rutas de ciudades
│       ├── distanceRoutes.js     # Rutas de distancias
│       └── graphRoutes.js        # Rutas de grafos
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno
└── README.md             # Documentación
```

## Endpoints Implementados

### Cities API (`/api/cities`)
- `GET /` - Obtener todas las ciudades
- `GET /:id` - Obtener ciudad por ID
- `GET /search?q=:searchTerm` - Buscar ciudades
- `GET /stats` - Obtener estadísticas de ciudades
- `GET /connections` - Obtener ciudades con conexiones
- `POST /` - Crear nueva ciudad
- `PUT /:id` - Actualizar ciudad
- `DELETE /:id` - Eliminar ciudad

### Distances API (`/api/distances`)
- `GET /` - Obtener todas las distancias
- `GET /:id` - Obtener distancia por ID
- `GET /cities/:city1Id/:city2Id` - Obtener distancia entre ciudades
- `GET /cities-by-name?city1=:name1&city2=:name2` - Distancia por nombres
- `GET /city/:cityId/connections` - Conexiones de una ciudad
- `GET /city/:cityId/nearby?maxDistance=:distance` - Ciudades cercanas
- `GET /stats` - Estadísticas de distancias
- `GET /routes` - Rutas para visualización
- `POST /` - Crear nueva distancia
- `PUT /:id` - Actualizar distancia
- `DELETE /:id` - Eliminar distancia

### Graph API (`/api/graph`)
- `GET /` - Datos del grafo para visualización
- `GET /matrix` - Matriz de adyacencia
- `GET /adjacency-list` - Lista de adyacencia
- `GET /shortest-path?from=:city1&to=:city2` - Ruta más corta
- `GET /stats` - Estadísticas del grafo

## Características de Seguridad

### Middleware Implementado
- **CORS** - Configuración para múltiples orígenes
- **Helmet** - Headers de seguridad HTTP
- **Rate Limiting** - Limitación de 100 requests por 15 minutos
- **Compression** - Compresión de respuestas
- **Morgan** - Logging de requests
- **Body Parsing** - Parsing JSON y URL-encoded con límites

### Validación de Datos
- Validación completa de entrada en todos los endpoints
- Manejo de errores consistente
- Sanitización de datos
- Responses estructuradas con formato JSON estándar

## Configuración de Base de Datos

La API se conecta a MySQL/MariaDB usando las siguientes configuraciones:

```javascript
// .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=reservation_graph_system
```

## Dependencias Principales

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "compression": "^1.7.4",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}
```

## Cómo Ejecutar

### Prerequisitos
1. Node.js 18+ instalado
2. MySQL/MariaDB corriendo (XAMPP)
3. Base de datos `reservation_graph_system` creada

### Pasos
1. Navegar al directorio:
   ```bash
   cd backend/graph-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno en `.env`

4. Ejecutar el servidor:
   ```bash
   node server.js
   ```

5. Verificar funcionamiento:
   - Health Check: http://localhost:3001/health
   - Documentación: http://localhost:3001/
   - API Ciudades: http://localhost:3001/api/cities
   - API Distancias: http://localhost:3001/api/distances
   - API Grafos: http://localhost:3001/api/graph

## Estado del Proyecto

✅ **COMPLETADO** - API Express.js totalmente implementada
- Todos los modelos, controladores y rutas implementados
- Servidor configurado con middleware de seguridad
- Integración completa con base de datos MySQL
- Documentación completa de endpoints
- Validación y manejo de errores implementado
- Configuración de CORS para frontend React

## Próximos Pasos

1. **Frontend React** - Crear interfaz de usuario para consumir la API
2. **Pruebas de Integración** - Verificar conectividad entre Spring Boot API y Express API
3. **Documentación Swagger** - Agregar documentación interactiva de la API
4. **Deployment** - Preparar para despliegue en producción

## Integración con el Proyecto

Esta API Express.js complementa la API Spring Boot existente:
- **Spring Boot API** (Puerto 8080) - Gestión de reservas
- **Express.js API** (Puerto 3001) - Gestión de grafos y visualización
- **MySQL Database** - Almacenamiento compartido
- **React Frontend** (Pendiente) - Interfaz unificada

El proyecto ahora cuenta con un stack completo de backend APIs listas para la integración con el frontend React.