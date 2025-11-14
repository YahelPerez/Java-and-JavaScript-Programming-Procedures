# Frontend React Application

## Descripción
Frontend React con TypeScript para el sistema integrado de reservas y visualización de grafos. Se conecta a dos APIs backend:
- **Spring Boot API** (Puerto 8080) - Gestión de reservas
- **Express.js API** (Puerto 3001) - Gestión de grafos y ciudades

## Arquitectura del Frontend

```
frontend/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── common/          # Componentes comunes (Header, Footer, Loading)
│   │   ├── reservations/    # Componentes de reservas
│   │   ├── cities/          # Componentes de ciudades
│   │   └── graphs/          # Componentes de visualización
│   ├── pages/               # Páginas principales
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Reservations.tsx # Gestión de reservas
│   │   ├── Cities.tsx       # Gestión de ciudades
│   │   └── GraphView.tsx    # Visualización de grafos
│   ├── services/            # Servicios de API
│   │   ├── reservationAPI.ts # API Spring Boot
│   │   └── graphAPI.ts      # API Express.js
│   ├── types/               # Tipos TypeScript
│   │   ├── Reservation.ts   # Tipos de reservas
│   │   └── Graph.ts         # Tipos de grafos
│   ├── hooks/               # Custom React hooks
│   ├── context/             # Context providers
│   └── utils/               # Utilidades
└── public/                  # Archivos públicos
```

## Stack Tecnológico Planificado

### Core
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **React Router DOM** - Enrutamiento SPA

### UI/UX
- **Material-UI (MUI)** - Componentes y diseño
- **Tailwind CSS** - Estilos utilitarios
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas

### Estado y Datos
- **React Query/TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **React Context** - Estado global de la aplicación

### Visualización
- **Chart.js + React-Chartjs-2** - Gráficos estadísticos
- **D3.js + React** - Visualización interactiva de grafos
- **Recharts** - Gráficos adicionales

### Testing
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **MSW (Mock Service Worker)** - Mocking de APIs

## Características Principales

### 📊 Dashboard Unificado
- Estadísticas en tiempo real de reservas y ciudades
- Gráficos de tendencias y métricas
- Tarjetas informativas con KPIs
- Navegación rápida a secciones principales

### 🏨 Gestión de Reservas
- **CRUD Completo**: Crear, leer, actualizar, eliminar reservas
- **Formularios Reactivos**: Validación en tiempo real
- **Filtros y Búsqueda**: Por fecha, estado, cliente
- **Estados**: Pendiente, Confirmada, Cancelada, Completada, No Show

### 🏙️ Gestión de Ciudades
- **CRUD de Ciudades**: Agregar, editar, eliminar ciudades
- **Gestión de Distancias**: Crear conexiones entre ciudades
- **Búsqueda y Filtros**: Por nombre, región, conexiones
- **Validación de Datos**: Coordenadas, nombres únicos

### 🗺️ Visualización de Grafos
- **Grafo Interactivo**: Visualización de ciudades y conexiones
- **Algoritmos**: Ruta más corta, ciudades cercanas
- **Interactividad**: Zoom, pan, selección de nodos
- **Información Contextual**: Tooltips con detalles

### 🔄 Integración APIs
- **Manejo de Errores**: Retry automático, fallbacks
- **Loading States**: Indicadores de carga consistentes
- **Optimistic Updates**: Actualizaciones inmediatas
- **Caching**: Estrategias de cache eficientes

## Flujos de Usuario Principales

### 1. Flujo de Reservas
```
Dashboard → Reservas → [Crear/Editar/Ver] → Confirmación → Dashboard
```

### 2. Flujo de Ciudades
```
Dashboard → Ciudades → [CRUD] → Visualizar en Grafo → Dashboard
```

### 3. Flujo de Análisis
```
Dashboard → Estadísticas → Grafos Interactivos → Reportes
```

## Configuración de Desarrollo

### Variables de Entorno
```env
REACT_APP_SPRING_API_URL=http://localhost:8080/api
REACT_APP_GRAPH_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### Scripts de Desarrollo
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build", 
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "test:coverage": "react-scripts test --coverage --watchAll=false"
}
```

## Estructura de Componentes

### Componentes de Layout
- **AppLayout** - Layout principal con navegación
- **Header** - Barra superior con menú
- **Sidebar** - Navegación lateral
- **Footer** - Pie de página

### Componentes de UI
- **DataTable** - Tabla de datos genérica
- **SearchBox** - Barra de búsqueda reutilizable
- **LoadingSpinner** - Indicador de carga
- **ErrorBoundary** - Manejo de errores
- **ConfirmDialog** - Diálogos de confirmación

### Componentes Específicos
- **ReservationCard** - Tarjeta de reserva
- **CityNode** - Nodo de ciudad en grafo
- **StatCard** - Tarjeta de estadística
- **GraphVisualization** - Visualizador principal de grafos

## APIs Integration

### Reservation API (Spring Boot)
```typescript
interface ReservationAPI {
  getReservations(): Promise<Reservation[]>
  createReservation(data: CreateReservationDto): Promise<Reservation>
  updateReservation(id: string, data: UpdateReservationDto): Promise<Reservation>
  deleteReservation(id: string): Promise<void>
  getStatistics(): Promise<ReservationStats>
}
```

### Graph API (Express.js)
```typescript
interface GraphAPI {
  getCities(): Promise<City[]>
  getDistances(): Promise<Distance[]>
  getGraphData(): Promise<GraphData>
  createCity(data: CreateCityDto): Promise<City>
  createDistance(data: CreateDistanceDto): Promise<Distance>
}
```

## Responsividad y Accesibilidad

### Responsive Design
- **Desktop First**: Optimizado para pantallas grandes
- **Mobile Friendly**: Adaptable a dispositivos móviles
- **Breakpoints**: sm, md, lg, xl según Tailwind CSS

### Accesibilidad (A11y)
- **Navegación por Teclado**: Tab, Enter, Space
- **Screen Reader**: ARIA labels y roles
- **Contraste**: Cumplimiento WCAG 2.1 AA
- **Focus Management**: Indicadores visuales claros

## Testing Strategy

### Unit Tests (70%)
- Componentes individuales
- Hooks personalizados
- Funciones utilitarias
- Servicios de API

### Integration Tests (20%)
- Flujos de usuario completos
- Interacción entre componentes
- Integración con APIs mock

### E2E Tests (10%)
- Casos de uso críticos
- Flujos de negocio principales
- Validación cross-browser

## Deployment

### Build Process
1. Type checking con TypeScript
2. Linting con ESLint
3. Testing automatizado
4. Build optimizado para producción
5. Análisis de bundle size

### Hosting Options
- **Vercel** - Recomendado para desarrollo
- **Netlify** - Alternativa con CI/CD
- **AWS S3 + CloudFront** - Para producción enterprise
- **GitHub Pages** - Para demos

## Performance Optimization

### Code Splitting
- Lazy loading de rutas
- Dynamic imports para componentes grandes
- Vendor bundle separation

### Caching Strategy
- React Query para datos del servidor
- Service Worker para recursos estáticos
- Local Storage para preferencias de usuario

### Bundle Optimization
- Tree shaking automático
- Minificación y compresión
- Asset optimization (imágenes, fonts)

## Roadmap de Desarrollo

### Fase 1: Fundación (Sprint Actual)
- ✅ Setup inicial del proyecto
- ⏳ Estructura base de componentes
- ⏳ Configuración de routing
- ⏳ Integración básica con APIs

### Fase 2: Funcionalidades Core
- ⏳ CRUD de reservas
- ⏳ CRUD de ciudades
- ⏳ Dashboard básico
- ⏳ Visualización de grafos

### Fase 3: Características Avanzadas
- ⏳ Estadísticas avanzadas
- ⏳ Filtros y búsquedas complejas
- ⏳ Exportación de datos
- ⏳ Notificaciones en tiempo real

### Fase 4: Optimización
- ⏳ Performance tuning
- ⏳ Testing comprehensivo
- ⏳ Documentación completa
- ⏳ Deployment automatizado

---

**Estado Actual:** ⚡ En desarrollo activo  
**Última Actualización:** 12 de Noviembre, 2025  
**Próximo Milestone:** Estructura base de componentes y routing