import express from 'express';
import { Distance } from '../models/Distance.js';
import { City } from '../models/City.js';

const router = express.Router();

/**
 * Get graph data for visualization
 * GET /api/graph
 */
router.get('/', async (req, res) => {
  try {
    const cities = await City.findAll();
    const distances = await Distance.findAll();
    
    // Format data for graph visualization
    const nodes = cities.map(city => ({
      id: city.id,
      label: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      createdAt: city.created_at
    }));

    const edges = distances.map(distance => ({
      id: distance.id,
      source: distance.city1_id,
      target: distance.city2_id,
      weight: distance.distance,
      sourceLabel: distance.city1_name,
      targetLabel: distance.city2_name
    }));

    res.status(200).json({
      success: true,
      data: {
        nodes,
        edges,
        metadata: {
          totalCities: nodes.length,
          totalConnections: edges.length,
          timestamp: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving graph data',
      error: error.message
    });
  }
});

/**
 * Get adjacency matrix
 * GET /api/graph/matrix
 */
router.get('/matrix', async (req, res) => {
  try {
    const cities = await City.findAll();
    const distances = await Distance.findAll();
    
    // Create adjacency matrix
    const size = cities.length;
    const matrix = Array(size).fill().map(() => Array(size).fill(null));
    const cityIndexMap = {};
    
    // Map city IDs to matrix indices
    cities.forEach((city, index) => {
      cityIndexMap[city.id] = index;
    });

    // Fill matrix with distances
    distances.forEach(distance => {
      const index1 = cityIndexMap[distance.city1_id];
      const index2 = cityIndexMap[distance.city2_id];
      
      if (index1 !== undefined && index2 !== undefined) {
        matrix[index1][index2] = distance.distance;
        matrix[index2][index1] = distance.distance; // Undirected graph
      }
    });

    res.status(200).json({
      success: true,
      data: {
        matrix,
        cities: cities.map((city, index) => ({
          index,
          id: city.id,
          name: city.name
        })),
        size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating adjacency matrix',
      error: error.message
    });
  }
});

/**
 * Get adjacency list
 * GET /api/graph/adjacency-list
 */
router.get('/adjacency-list', async (req, res) => {
  try {
    const cities = await City.findAll();
    const adjacencyList = {};
    
    // Initialize adjacency list for all cities
    for (const city of cities) {
      const connections = await Distance.getCityConnections(city.id);
      adjacencyList[city.name] = connections.map(conn => ({
        city: conn.connected_city_name,
        distance: conn.distance
      }));
    }

    res.status(200).json({
      success: true,
      data: adjacencyList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating adjacency list',
      error: error.message
    });
  }
});

/**
 * Find shortest path between two cities (simplified version)
 * GET /api/graph/shortest-path?from=:cityName&to=:cityName
 */
router.get('/shortest-path', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both from and to city names are required'
      });
    }

    const fromCity = await City.findByName(from);
    const toCity = await City.findByName(to);
    
    if (!fromCity || !toCity) {
      return res.status(404).json({
        success: false,
        message: 'One or both cities not found'
      });
    }

    // Check for direct connection
    const directConnection = await Distance.findBetweenCities(fromCity.id, toCity.id);
    
    if (directConnection) {
      res.status(200).json({
        success: true,
        data: {
          path: [from, to],
          distance: directConnection.distance,
          hops: 1,
          type: 'direct'
        }
      });
    } else {
      // For now, return that no path found
      // TODO: Implement Dijkstra's algorithm for multi-hop paths
      res.status(200).json({
        success: true,
        data: {
          path: [],
          distance: null,
          hops: 0,
          type: 'no_direct_path',
          message: 'No direct path found. Multi-hop pathfinding not implemented yet.'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding shortest path',
      error: error.message
    });
  }
});

/**
 * Get network statistics
 * GET /api/graph/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const cityStats = await City.getStatistics();
    const distanceStats = await Distance.getStatistics();
    
    // Calculate additional graph metrics
    const cities = await City.findAll();
    let totalDegree = 0;
    
    for (const city of cities) {
      const connections = await Distance.getCityConnections(city.id);
      totalDegree += connections.length;
    }
    
    const averageDegree = cities.length > 0 ? (totalDegree / cities.length).toFixed(2) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        cities: cityStats,
        distances: distanceStats,
        graph: {
          total_nodes: cities.length,
          total_edges: distanceStats.total_distances,
          average_degree: parseFloat(averageDegree),
          density: cities.length > 1 ? 
            ((2 * distanceStats.total_distances) / (cities.length * (cities.length - 1))).toFixed(4) : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving graph statistics',
      error: error.message
    });
  }
});

export default router;