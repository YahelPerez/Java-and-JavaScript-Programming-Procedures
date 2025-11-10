# Sprint 2 - Jest Testing Screenshots Documentation

Este directorio contiene las capturas de pantalla que demuestran el cumplimiento de los objetivos del Sprint 2: módulo de grafos con JavaScript y Jest.

## 📸 Capturas de Evidencia

### 1. **npm-test-1.png**
- **Descripción:** Primera parte de la ejecución de tests con Jest
- **Muestra:** Detalle de todos los grupos de tests ejecutándose
- **Comando:** `npm test`

### 2. **npm-test-2.png**
- **Descripción:** Resumen final de la ejecución de tests
- **Muestra:** 58 tests pasados, 1 test suite pasado, tiempo de ejecución
- **Comando:** `npm test`

### 3. **npm-test-coverage-1.png**
- **Descripción:** Primera parte del reporte de cobertura con Jest
- **Muestra:** Ejecución de tests con flag de cobertura
- **Comando:** `npm test -- --coverage`

### 4. **npm-test-coverage-2.png**
- **Descripción:** Tabla final de cobertura de código
- **Muestra:** 100% Statements, 98.52% Branches, 100% Functions, 100% Lines
- **Comando:** `npm test -- --coverage`

## 🎯 Objetivos Demostrados Sprint 2

✅ **Configuración de Jest:** Framework de testing configurado correctamente  
✅ **Módulo Graph.js:** Clase Graph implementada con todas las funcionalidades  
✅ **Suite Completa de Tests:** 58 tests cubriendo casos positivos, negativos y edge cases  
✅ **Manejo de Errores:** Validación exhaustiva de inputs inválidos  
✅ **Cobertura Excepcional:** 100%+ en la mayoría de métricas (supera 90% requerido)  
✅ **Tests Robustos:** Todos los tests pasan sin errores  
✅ **Arquitectura Limpia:** Código bien estructurado y documentado  

## 📊 Métricas Alcanzadas Sprint 2

- **Tests Totales:** 58
- **Test Suites:** 1 pasado
- **Cobertura de Statements:** 100%
- **Cobertura de Branches:** 98.52%
- **Cobertura de Functions:** 100%
- **Cobertura de Lines:** 100%
- **Tiempo de Ejecución:** ~2 segundos
- **Estado:** ✅ ALL TESTS PASSED

## 🔧 Funcionalidades Probadas

### Graph - City Management (19 tests)
- addCity: Agregar ciudades con validación
- hasCity: Verificar existencia de ciudades
- removeCity: Eliminar ciudades y sus conexiones
- getAllCities: Listar todas las ciudades

### Graph - Distance Management (17 tests)
- addDistance: Agregar distancias bidireccionales
- getDistance: Consultar distancias entre ciudades
- Validación de inputs: números negativos, NaN, Infinity

### Graph - Nearby Cities (12 tests)
- getNearbyCities: Filtrar y ordenar ciudades por distancia
- getCityConnections: Obtener todas las conexiones de una ciudad

### Graph - Utility Methods (8 tests)
- getCityCount, getEdgeCount: Contadores
- clear: Limpiar grafo completo
- toJSON: Serialización a JSON

### Graph - Integration Tests (2 tests)
- Operaciones complejas en grafos grandes
- Manejo de casos edge gracefully

---

**Fecha:** Noviembre 9, 2025  
**Proyecto:** Módulo de Grafos - Sprint 2  
**Tecnologías:** JavaScript, Node.js, Jest  
**Desarrollador:** YahelPerez