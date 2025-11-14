import axios from 'axios'
import { City, Distance, GraphData } from '../types'

// Mock data for demo
const mockCities: City[] = [
  { id: 1, name: 'Mexico City', description: 'Capital de México' },
  { id: 2, name: 'Guadalajara', description: 'Perla Tapatía' },
  { id: 3, name: 'Monterrey', description: 'Sultana del Norte' },
  { id: 4, name: 'Cancun', description: 'Paraíso Turístico' },
  { id: 5, name: 'Tijuana', description: 'Ciudad Fronteriza' },
  { id: 6, name: 'Puebla', description: 'Ciudad de los Ángeles' },
  { id: 7, name: 'León', description: 'Capital del Calzado' },
  { id: 8, name: 'Mérida', description: 'Ciudad Blanca' },
  { id: 9, name: 'Querétaro', description: 'Ciudad Colonial' },
  { id: 10, name: 'Toluca', description: 'Ciudad de los Volcanes' }
]

const mockDistances: Distance[] = [
  { id: 1, fromCityId: 1, toCityId: 2, distance: 460 },   // Mexico City ↔ Guadalajara
  { id: 2, fromCityId: 1, toCityId: 3, distance: 740 },   // Mexico City ↔ Monterrey
  { id: 3, fromCityId: 1, toCityId: 6, distance: 120 },   // Mexico City ↔ Puebla
  { id: 4, fromCityId: 1, toCityId: 10, distance: 65 },   // Mexico City ↔ Toluca
  { id: 5, fromCityId: 1, toCityId: 9, distance: 200 },   // Mexico City ↔ Querétaro
  { id: 6, fromCityId: 2, toCityId: 3, distance: 560 },   // Guadalajara ↔ Monterrey
  { id: 7, fromCityId: 2, toCityId: 7, distance: 220 },   // Guadalajara ↔ León
  { id: 8, fromCityId: 3, toCityId: 9, distance: 380 },   // Monterrey ↔ Querétaro
  { id: 9, fromCityId: 6, toCityId: 9, distance: 180 },   // Puebla ↔ Querétaro
  { id: 10, fromCityId: 7, toCityId: 9, distance: 280 },  // León ↔ Querétaro
  // Conexiones adicionales para hacer el grafo completamente conectado
  { id: 11, fromCityId: 5, toCityId: 1, distance: 2650 }, // Tijuana ↔ Mexico City
  { id: 12, fromCityId: 5, toCityId: 2, distance: 2100 }, // Tijuana ↔ Guadalajara
  { id: 13, fromCityId: 4, toCityId: 8, distance: 320 },  // Cancun ↔ Mérida
  { id: 14, fromCityId: 4, toCityId: 1, distance: 1650 }, // Cancun ↔ Mexico City
  { id: 15, fromCityId: 8, toCityId: 1, distance: 1550 }, // Mérida ↔ Mexico City
  { id: 16, fromCityId: 2, toCityId: 10, distance: 350 }, // Guadalajara ↔ Toluca
  { id: 17, fromCityId: 7, toCityId: 10, distance: 190 }, // León ↔ Toluca
  { id: 18, fromCityId: 5, toCityId: 3, distance: 2200 }, // Tijuana ↔ Monterrey
  // Conexiones específicas para las rutas problemáticas
  { id: 19, fromCityId: 5, toCityId: 9, distance: 2850 }, // Tijuana ↔ Querétaro (directo)
  { id: 20, fromCityId: 4, toCityId: 7, distance: 1870 }, // Cancun ↔ León
  { id: 21, fromCityId: 8, toCityId: 5, distance: 3200 }, // Mérida ↔ Tijuana
  // Conexiones adicionales para mayor conectividad
  { id: 22, fromCityId: 4, toCityId: 6, distance: 1530 }, // Cancun ↔ Puebla
  { id: 23, fromCityId: 8, toCityId: 2, distance: 1320 }, // Mérida ↔ Guadalajara
  { id: 24, fromCityId: 8, toCityId: 7, distance: 1430 }, // Mérida ↔ León
  { id: 25, fromCityId: 4, toCityId: 3, distance: 2100 }, // Cancun ↔ Monterrey
]

const graphAPI = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simplified and robust shortest path algorithm
const findShortestPathMock = (fromId: number, toId: number): {
  path: number[],
  totalDistance: number,
  cities: City[]
} => {
  console.log(`\n🔍 FINDING PATH: ${mockCities.find(c => c.id === fromId)?.name} → ${mockCities.find(c => c.id === toId)?.name}`)
  
  // Same city check
  if (fromId === toId) {
    const city = mockCities.find(c => c.id === fromId)!
    return { path: [fromId], totalDistance: 0, cities: [city] }
  }
  
  // Build simple adjacency list
  const adj = new Map<number, {to: number, weight: number}[]>()
  mockCities.forEach(city => adj.set(city.id, []))
  
  // Add bidirectional edges
  mockDistances.forEach(d => {
    adj.get(d.fromCityId)!.push({to: d.toCityId, weight: d.distance})
    adj.get(d.toCityId)!.push({to: d.fromCityId, weight: d.distance})
  })
  
  // Show connections for debugging
  console.log(`From ${mockCities.find(c => c.id === fromId)?.name}:`, 
    adj.get(fromId)!.map(e => `${mockCities.find(c => c.id === e.to)?.name}(${e.weight})`)
  )
  
  // Simple Dijkstra
  const dist = new Map<number, number>()
  const prev = new Map<number, number>()
  const visited = new Set<number>()
  
  // Initialize
  mockCities.forEach(city => dist.set(city.id, city.id === fromId ? 0 : 999999))
  
  while (visited.size < mockCities.length) {
    // Find min unvisited
    let minNode = -1
    let minDist = 999999
    
    for (const [node, distance] of dist.entries()) {
      if (!visited.has(node) && distance < minDist) {
        minDist = distance
        minNode = node
      }
    }
    
    if (minNode === -1 || minDist === 999999) break
    
    visited.add(minNode)
    if (minNode === toId) break
    
    // Update neighbors
    const neighbors = adj.get(minNode)!
    const currentDist = dist.get(minNode)!
    
    for (const {to, weight} of neighbors) {
      if (!visited.has(to)) {
        const newDist = currentDist + weight
        if (newDist < dist.get(to)!) {
          dist.set(to, newDist)
          prev.set(to, minNode)
        }
      }
    }
  }
  
  // Build path
  const path: number[] = []
  let current = toId
  
  while (current !== undefined) {
    path.unshift(current)
    current = prev.get(current)!
    if (current === fromId) {
      path.unshift(current)
      break
    }
  }
  
  const finalDistance = dist.get(toId)!
  
  if (path.length < 2 || path[0] !== fromId || finalDistance >= 999999) {
    throw new Error(`No path from ${mockCities.find(c => c.id === fromId)?.name} to ${mockCities.find(c => c.id === toId)?.name}`)
  }
  
  const cities = path.map(id => mockCities.find(c => c.id === id)!).filter(c => c)
  
  console.log(`✅ SUCCESS: ${cities.map(c => c.name).join(' → ')} (${finalDistance} km)`)
  return { path, totalDistance: finalDistance, cities }
}

// Debug function to test specific problematic routes
const testProblematicRoutes = () => {
  console.log('🧪 Testing problematic routes...')
  
  const problematicRoutes = [
    { from: 5, to: 9, name: 'Tijuana → Querétaro' },    // Tijuana (5) → Querétaro (9)
    { from: 4, to: 7, name: 'Cancún → León' },          // Cancún (4) → León (7)
    { from: 8, to: 5, name: 'Mérida → Tijuana' }        // Mérida (8) → Tijuana (5)
  ]
  
  problematicRoutes.forEach(route => {
    console.log(`\n🔍 Testing ${route.name}...`)
    try {
      const result = findShortestPathMock(route.from, route.to)
      console.log(`✅ ${route.name}: SUCCESS - ${result.totalDistance} km`)
      console.log(`   Path: ${result.cities.map(c => c.name).join(' → ')}`)
    } catch (error) {
      console.error(`❌ ${route.name}: FAILED - ${error instanceof Error ? error.message : String(error)}`)
    }
  })
}

// Make test function available globally for manual testing
;(window as any).testRoutes = testProblematicRoutes

export const graphService = {
  // Health check
  getHealth: async (): Promise<{ status: string, timestamp: string }> => {
    const response = await graphAPI.get('/health')
    return response.data
  },

  // City operations
  getAllCities: async (): Promise<City[]> => {
    try {
      const response = await graphAPI.get('/cities')
      return response.data
    } catch (error) {
      console.warn('Using mock data - API not available')
      return mockCities
    }
  },

  getCityById: async (id: number): Promise<City> => {
    const response = await graphAPI.get(`/cities/${id}`)
    return response.data
  },

  createCity: async (city: Omit<City, 'id'>): Promise<City> => {
    const response = await graphAPI.post('/cities', city)
    return response.data
  },

  updateCity: async (id: number, city: Partial<City>): Promise<City> => {
    const response = await graphAPI.put(`/cities/${id}`, city)
    return response.data
  },

  deleteCity: async (id: number): Promise<void> => {
    await graphAPI.delete(`/cities/${id}`)
  },

  // Distance operations
  getAllDistances: async (): Promise<Distance[]> => {
    try {
      const response = await graphAPI.get('/distances')
      return response.data
    } catch (error) {
      console.warn('Using mock data - API not available')
      return mockDistances
    }
  },

  getDistanceById: async (id: number): Promise<Distance> => {
    const response = await graphAPI.get(`/distances/${id}`)
    return response.data
  },

  createDistance: async (distance: Omit<Distance, 'id'>): Promise<Distance> => {
    const response = await graphAPI.post('/distances', distance)
    return response.data
  },

  updateDistance: async (id: number, distance: Partial<Distance>): Promise<Distance> => {
    const response = await graphAPI.put(`/distances/${id}`, distance)
    return response.data
  },

  deleteDistance: async (id: number): Promise<void> => {
    await graphAPI.delete(`/distances/${id}`)
  },

  // Graph operations
  getGraphData: async (): Promise<GraphData> => {
    try {
      const response = await graphAPI.get('/graph')
      return response.data
    } catch (error) {
      console.warn('Using mock data - API not available')
      return {
        nodes: mockCities,
        edges: mockDistances.map(d => ({
          source: d.fromCityId,
          target: d.toCityId,
          weight: d.distance
        }))
      }
    }
  },

  getShortestPath: async (fromId: number, toId: number): Promise<{
    path: number[],
    totalDistance: number,
    cities: City[]
  }> => {
    try {
      const response = await graphAPI.get(`/graph/shortest-path?from=${fromId}&to=${toId}`)
      return response.data
    } catch (error) {
      console.warn('Using mock algorithm - API not available')
      return findShortestPathMock(fromId, toId)
    }
  }
}