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
  { id: 1, fromCityId: 1, toCityId: 2, distance: 460 },
  { id: 2, fromCityId: 1, toCityId: 3, distance: 740 },
  { id: 3, fromCityId: 1, toCityId: 6, distance: 120 },
  { id: 4, fromCityId: 2, toCityId: 3, distance: 560 },
  { id: 5, fromCityId: 2, toCityId: 7, distance: 220 },
  { id: 6, fromCityId: 3, toCityId: 9, distance: 380 },
  { id: 7, fromCityId: 4, toCityId: 8, distance: 320 },
  { id: 8, fromCityId: 5, toCityId: 1, distance: 2650 },
  { id: 9, fromCityId: 6, toCityId: 9, distance: 180 },
  { id: 10, fromCityId: 7, toCityId: 9, distance: 280 }
]

const graphAPI = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dijkstra's algorithm implementation for mock data
const findShortestPathMock = (fromId: number, toId: number): {
  path: number[],
  totalDistance: number,
  cities: City[]
} => {
  // Build adjacency list from mock distances (bidirectional)
  const graph: Map<number, Array<{node: number, weight: number}>> = new Map()
  
  // Initialize graph with all cities
  mockCities.forEach(city => {
    graph.set(city.id, [])
  })
  
  // Add edges (bidirectional)
  mockDistances.forEach(distance => {
    graph.get(distance.fromCityId)?.push({
      node: distance.toCityId,
      weight: distance.distance
    })
    graph.get(distance.toCityId)?.push({
      node: distance.fromCityId,
      weight: distance.distance
    })
  })
  
  // Dijkstra's algorithm
  const distances: Map<number, number> = new Map()
  const previous: Map<number, number | null> = new Map()
  const visited: Set<number> = new Set()
  const queue: Array<{node: number, distance: number}> = []
  
  // Initialize distances
  mockCities.forEach(city => {
    distances.set(city.id, city.id === fromId ? 0 : Infinity)
    previous.set(city.id, null)
  })
  
  queue.push({node: fromId, distance: 0})
  
  while (queue.length > 0) {
    // Sort queue to get minimum distance node
    queue.sort((a, b) => a.distance - b.distance)
    const current = queue.shift()!
    
    if (visited.has(current.node)) continue
    visited.add(current.node)
    
    if (current.node === toId) break
    
    const neighbors = graph.get(current.node) || []
    
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue
      
      const currentDistance = distances.get(current.node) || Infinity
      const newDistance = currentDistance + neighbor.weight
      
      if (newDistance < (distances.get(neighbor.node) || Infinity)) {
        distances.set(neighbor.node, newDistance)
        previous.set(neighbor.node, current.node)
        queue.push({node: neighbor.node, distance: newDistance})
      }
    }
  }
  
  // Reconstruct path
  const path: number[] = []
  let currentNode: number | null = toId
  
  while (currentNode !== null) {
    path.unshift(currentNode)
    currentNode = previous.get(currentNode) || null
  }
  
  // Check if path was found
  if (path.length === 0 || path[0] !== fromId) {
    throw new Error(`No path found from city ${fromId} to city ${toId}`)
  }
  
  const totalDistance = distances.get(toId) || 0
  const cities = path.map(cityId => 
    mockCities.find(city => city.id === cityId)!
  ).filter(city => city)
  
  return {
    path,
    totalDistance,
    cities
  }
}

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
      // Fallback to local implementation of Dijkstra's algorithm
      return findShortestPathMock(fromId, toId)
    }
  }
}