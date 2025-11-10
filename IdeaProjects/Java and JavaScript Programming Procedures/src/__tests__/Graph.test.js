const Graph = require('../graph/Graph');

describe('Graph - City Management', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  describe('addCity', () => {
    test('should add a city successfully', () => {
      graph.addCity('Mexico City');
      expect(graph.hasCity('Mexico City')).toBe(true);
      expect(graph.getCityCount()).toBe(1);
    });

    test('should add multiple cities', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addCity('Monterrey');
      
      expect(graph.getCityCount()).toBe(3);
      expect(graph.getAllCities()).toEqual(
        expect.arrayContaining(['Mexico City', 'Guadalajara', 'Monterrey'])
      );
    });

    test('should throw error for null city name', () => {
      expect(() => graph.addCity(null)).toThrow('City name must be a non-empty string');
    });

    test('should throw error for undefined city name', () => {
      expect(() => graph.addCity(undefined)).toThrow('City name must be a non-empty string');
    });

    test('should throw error for empty string', () => {
      expect(() => graph.addCity('')).toThrow('City name must be a non-empty string');
    });

    test('should throw error for whitespace-only string', () => {
      expect(() => graph.addCity('   ')).toThrow('City name cannot be empty or whitespace');
    });

    test('should throw error for non-string input', () => {
      expect(() => graph.addCity(123)).toThrow('City name must be a non-empty string');
      expect(() => graph.addCity({})).toThrow('City name must be a non-empty string');
      expect(() => graph.addCity([])).toThrow('City name must be a non-empty string');
    });

    test('should throw error for duplicate city', () => {
      graph.addCity('Mexico City');
      expect(() => graph.addCity('Mexico City')).toThrow('City "Mexico City" already exists');
    });

    test('should trim city names', () => {
      graph.addCity('  Mexico City  ');
      expect(graph.hasCity('Mexico City')).toBe(true);
    });
  });

  describe('hasCity', () => {
    beforeEach(() => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
    });

    test('should return true for existing city', () => {
      expect(graph.hasCity('Mexico City')).toBe(true);
    });

    test('should return false for non-existing city', () => {
      expect(graph.hasCity('Unknown City')).toBe(false);
    });

    test('should return false for null', () => {
      expect(graph.hasCity(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(graph.hasCity(undefined)).toBe(false);
    });

    test('should return false for non-string', () => {
      expect(graph.hasCity(123)).toBe(false);
    });
  });

  describe('removeCity', () => {
    beforeEach(() => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addDistance('Mexico City', 'Guadalajara', 500);
    });

    test('should remove existing city', () => {
      const result = graph.removeCity('Mexico City');
      
      expect(result).toBe(true);
      expect(graph.hasCity('Mexico City')).toBe(false);
      expect(graph.getCityCount()).toBe(1);
    });

    test('should remove city connections when removing city', () => {
      graph.removeCity('Mexico City');
      
      const guadalajaraConnections = graph.getCityConnections('Guadalajara');
      expect(guadalajaraConnections).toHaveLength(0);
    });

    test('should return false for non-existing city', () => {
      const result = graph.removeCity('Unknown City');
      expect(result).toBe(false);
    });

    test('should return false for invalid input', () => {
      expect(graph.removeCity(null)).toBe(false);
      expect(graph.removeCity(undefined)).toBe(false);
      expect(graph.removeCity(123)).toBe(false);
    });
  });

  describe('getAllCities', () => {
    test('should return empty array for empty graph', () => {
      expect(graph.getAllCities()).toEqual([]);
    });

    test('should return all city names', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addCity('Monterrey');
      
      const cities = graph.getAllCities();
      expect(cities).toHaveLength(3);
      expect(cities).toEqual(
        expect.arrayContaining(['Mexico City', 'Guadalajara', 'Monterrey'])
      );
    });
  });
});

describe('Graph - Distance Management', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
    graph.addCity('Mexico City');
    graph.addCity('Guadalajara');
    graph.addCity('Monterrey');
  });

  describe('addDistance', () => {
    test('should add distance between two cities', () => {
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      
      expect(graph.getDistance('Mexico City', 'Guadalajara')).toBe(500);
      expect(graph.getEdgeCount()).toBe(1);
    });

    test('should add bidirectional distance', () => {
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      
      expect(graph.getDistance('Mexico City', 'Guadalajara')).toBe(500);
      expect(graph.getDistance('Guadalajara', 'Mexico City')).toBe(500);
    });

    test('should throw error for missing city names', () => {
      expect(() => graph.addDistance('', 'Guadalajara', 100))
        .toThrow('Both city names are required');
      expect(() => graph.addDistance('Mexico City', null, 100))
        .toThrow('Both city names are required');
    });

    test('should throw error for non-existing city', () => {
      expect(() => graph.addDistance('Mexico City', 'Unknown City', 100))
        .toThrow('City "Unknown City" does not exist');
      expect(() => graph.addDistance('Unknown City', 'Mexico City', 100))
        .toThrow('City "Unknown City" does not exist');
    });

    test('should throw error for negative distance', () => {
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', -100))
        .toThrow('Distance must be a positive number');
    });

    test('should throw error for zero distance', () => {
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', 0))
        .toThrow('Distance must be a positive number');
    });

    test('should throw error for non-number distance', () => {
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', 'invalid'))
        .toThrow('Distance must be a positive number');
    });

    test('should throw error for NaN distance', () => {
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', NaN))
        .toThrow('Distance must be a valid finite number');
    });

    test('should throw error for Infinity distance', () => {
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', Infinity))
        .toThrow('Distance must be a valid finite number');
    });

    test('should throw error for same city connection', () => {
      expect(() => graph.addDistance('Mexico City', 'Mexico City', 100))
        .toThrow('Cannot add distance from a city to itself');
    });

    test('should throw error for duplicate distance', () => {
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      
      expect(() => graph.addDistance('Mexico City', 'Guadalajara', 600))
        .toThrow('Distance between "Mexico City" and "Guadalajara" already exists');
    });

    test('should handle whitespace in city names', () => {
      graph.addDistance('  Mexico City  ', '  Guadalajara  ', 500);
      
      expect(graph.getDistance('Mexico City', 'Guadalajara')).toBe(500);
    });
  });

  describe('getDistance', () => {
    beforeEach(() => {
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      graph.addDistance('Mexico City', 'Monterrey', 900);
    });

    test('should get distance between connected cities', () => {
      expect(graph.getDistance('Mexico City', 'Guadalajara')).toBe(500);
    });

    test('should return same distance regardless of order', () => {
      const dist1 = graph.getDistance('Mexico City', 'Guadalajara');
      const dist2 = graph.getDistance('Guadalajara', 'Mexico City');
      
      expect(dist1).toBe(dist2);
    });

    test('should return null for non-connected cities', () => {
      expect(graph.getDistance('Guadalajara', 'Monterrey')).toBeNull();
    });

    test('should return null for non-existing city', () => {
      expect(graph.getDistance('Mexico City', 'Unknown City')).toBeNull();
    });

    test('should return null for invalid input', () => {
      expect(graph.getDistance(null, 'Mexico City')).toBeNull();
      expect(graph.getDistance('Mexico City', undefined)).toBeNull();
    });
  });
});

describe('Graph - Nearby Cities', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
    graph.addCity('Mexico City');
    graph.addCity('Guadalajara');
    graph.addCity('Monterrey');
    graph.addCity('Cancun');
    graph.addCity('Tijuana');
    
    graph.addDistance('Mexico City', 'Guadalajara', 500);
    graph.addDistance('Mexico City', 'Monterrey', 900);
    graph.addDistance('Mexico City', 'Cancun', 1600);
    graph.addDistance('Guadalajara', 'Monterrey', 700);
  });

  describe('getNearbyCities', () => {
    test('should return nearby cities within distance', () => {
      const nearby = graph.getNearbyCities('Mexico City', 1000);
      
      expect(nearby).toHaveLength(2);
      expect(nearby[0]).toEqual({ city: 'Guadalajara', distance: 500 });
      expect(nearby[1]).toEqual({ city: 'Monterrey', distance: 900 });
    });

    test('should return cities sorted by distance', () => {
      const nearby = graph.getNearbyCities('Mexico City', 2000);
      
      expect(nearby).toHaveLength(3);
      expect(nearby[0].distance).toBe(500);
      expect(nearby[1].distance).toBe(900);
      expect(nearby[2].distance).toBe(1600);
    });

    test('should return empty array if no cities within distance', () => {
      const nearby = graph.getNearbyCities('Mexico City', 100);
      
      expect(nearby).toEqual([]);
    });

    test('should return empty array for city with no connections', () => {
      const nearby = graph.getNearbyCities('Tijuana', 1000);
      
      expect(nearby).toEqual([]);
    });

    test('should throw error for non-existing city', () => {
      expect(() => graph.getNearbyCities('Unknown City', 1000))
        .toThrow('City "Unknown City" does not exist');
    });

    test('should throw error for invalid city name', () => {
      expect(() => graph.getNearbyCities(null, 1000))
        .toThrow('City name must be a non-empty string');
      expect(() => graph.getNearbyCities('', 1000))
        .toThrow('City name must be a non-empty string');
    });

    test('should throw error for invalid max distance', () => {
      expect(() => graph.getNearbyCities('Mexico City', -100))
        .toThrow('Maximum distance must be a positive number');
      expect(() => graph.getNearbyCities('Mexico City', 0))
        .toThrow('Maximum distance must be a positive number');
      expect(() => graph.getNearbyCities('Mexico City', 'invalid'))
        .toThrow('Maximum distance must be a positive number');
    });

    test('should handle exact distance match', () => {
      const nearby = graph.getNearbyCities('Mexico City', 500);
      
      expect(nearby).toHaveLength(1);
      expect(nearby[0].city).toBe('Guadalajara');
    });
  });

  describe('getCityConnections', () => {
    test('should return all connections for a city', () => {
      const connections = graph.getCityConnections('Mexico City');
      
      expect(connections).toHaveLength(3);
      expect(connections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ city: 'Guadalajara', distance: 500 }),
          expect.objectContaining({ city: 'Monterrey', distance: 900 }),
          expect.objectContaining({ city: 'Cancun', distance: 1600 })
        ])
      );
    });

    test('should return empty array for city with no connections', () => {
      const connections = graph.getCityConnections('Tijuana');
      
      expect(connections).toEqual([]);
    });

    test('should return empty array for non-existing city', () => {
      const connections = graph.getCityConnections('Unknown City');
      
      expect(connections).toEqual([]);
    });

    test('should return empty array for invalid input', () => {
      expect(graph.getCityConnections(null)).toEqual([]);
      expect(graph.getCityConnections(undefined)).toEqual([]);
      expect(graph.getCityConnections(123)).toEqual([]);
    });
  });
});

describe('Graph - Utility Methods', () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  describe('getCityCount', () => {
    test('should return 0 for empty graph', () => {
      expect(graph.getCityCount()).toBe(0);
    });

    test('should return correct count', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      
      expect(graph.getCityCount()).toBe(2);
    });
  });

  describe('getEdgeCount', () => {
    test('should return 0 for graph with no edges', () => {
      graph.addCity('Mexico City');
      
      expect(graph.getEdgeCount()).toBe(0);
    });

    test('should return correct count', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addCity('Monterrey');
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      graph.addDistance('Mexico City', 'Monterrey', 900);
      
      expect(graph.getEdgeCount()).toBe(2);
    });
  });

  describe('clear', () => {
    test('should clear all cities and edges', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      
      graph.clear();
      
      expect(graph.getCityCount()).toBe(0);
      expect(graph.getEdgeCount()).toBe(0);
      expect(graph.getAllCities()).toEqual([]);
    });
  });

  describe('toJSON', () => {
    test('should return empty structure for empty graph', () => {
      const json = graph.toJSON();
      
      expect(json).toEqual({
        cities: [],
        edges: []
      });
    });

    test('should return correct JSON structure', () => {
      graph.addCity('Mexico City');
      graph.addCity('Guadalajara');
      graph.addDistance('Mexico City', 'Guadalajara', 500);
      
      const json = graph.toJSON();
      
      expect(json.cities).toHaveLength(2);
      expect(json.edges).toHaveLength(1);
      expect(json.cities).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Mexico City', connectionCount: 1 }),
          expect.objectContaining({ name: 'Guadalajara', connectionCount: 1 })
        ])
      );
    });
  });
});

describe('Graph - Integration Tests', () => {
  test('should handle complex graph operations', () => {
    const graph = new Graph();
    
    // Build a network of Mexican cities
    const cities = ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun', 'Tijuana', 'Puebla'];
    cities.forEach(city => graph.addCity(city));
    
    // Add distances
    graph.addDistance('Mexico City', 'Guadalajara', 500);
    graph.addDistance('Mexico City', 'Monterrey', 900);
    graph.addDistance('Mexico City', 'Puebla', 130);
    graph.addDistance('Guadalajara', 'Monterrey', 700);
    graph.addDistance('Monterrey', 'Tijuana', 1200);
    graph.addDistance('Mexico City', 'Cancun', 1600);
    
    // Test queries
    expect(graph.getCityCount()).toBe(6);
    expect(graph.getEdgeCount()).toBe(6);
    
    const nearbyMexicoCity = graph.getNearbyCities('Mexico City', 1000);
    expect(nearbyMexicoCity).toHaveLength(3);
    
    const nearbyMonterrey = graph.getNearbyCities('Monterrey', 1000);
    expect(nearbyMonterrey).toHaveLength(2);
  });

  test('should handle edge cases gracefully', () => {
    const graph = new Graph();
    
    // Single city, no connections
    graph.addCity('Isolated City');
    expect(graph.getNearbyCities('Isolated City', 1000)).toEqual([]);
    expect(graph.getCityConnections('Isolated City')).toEqual([]);
    
    // Two cities, one connection
    graph.addCity('City A');
    graph.addDistance('Isolated City', 'City A', 100);
    expect(graph.getNearbyCities('Isolated City', 50)).toEqual([]);
    expect(graph.getNearbyCities('Isolated City', 100)).toHaveLength(1);
  });
});
