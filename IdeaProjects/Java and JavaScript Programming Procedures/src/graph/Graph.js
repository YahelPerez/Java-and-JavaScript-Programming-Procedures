/**
 * Graph class for managing cities and distances between them
 * Represents a weighted undirected graph for city network visualization
 */
class Graph {
  constructor() {
    this.cities = new Map();
    this.edges = new Map();
  }

  /**
   * Add a city to the graph
   * @param {string} cityName - Name of the city
   * @throws {Error} If city name is invalid
   */
  addCity(cityName) {
    if (!cityName || typeof cityName !== 'string') {
      throw new Error('City name must be a non-empty string');
    }

    const normalizedName = cityName.trim();
    if (normalizedName.length === 0) {
      throw new Error('City name cannot be empty or whitespace');
    }

    if (this.cities.has(normalizedName)) {
      throw new Error(`City "${normalizedName}" already exists`);
    }

    this.cities.set(normalizedName, {
      name: normalizedName,
      connections: []
    });
  }

  /**
   * Add a distance between two cities (bidirectional edge)
   * @param {string} city1 - First city name
   * @param {string} city2 - Second city name
   * @param {number} distance - Distance between cities
   * @throws {Error} If parameters are invalid or cities don't exist
   */
  addDistance(city1, city2, distance) {
    if (!city1 || !city2) {
      throw new Error('Both city names are required');
    }

    if (typeof distance !== 'number' || distance <= 0) {
      throw new Error('Distance must be a positive number');
    }

    if (isNaN(distance) || !isFinite(distance)) {
      throw new Error('Distance must be a valid finite number');
    }

    const normalizedCity1 = city1.trim();
    const normalizedCity2 = city2.trim();

    if (!this.cities.has(normalizedCity1)) {
      throw new Error(`City "${normalizedCity1}" does not exist`);
    }

    if (!this.cities.has(normalizedCity2)) {
      throw new Error(`City "${normalizedCity2}" does not exist`);
    }

    if (normalizedCity1 === normalizedCity2) {
      throw new Error('Cannot add distance from a city to itself');
    }

    const edgeKey = this.getEdgeKey(normalizedCity1, normalizedCity2);
    if (this.edges.has(edgeKey)) {
      throw new Error(`Distance between "${normalizedCity1}" and "${normalizedCity2}" already exists`);
    }

    // Add bidirectional edge
    this.edges.set(edgeKey, {
      city1: normalizedCity1,
      city2: normalizedCity2,
      distance: distance
    });

    // Update city connections
    this.cities.get(normalizedCity1).connections.push({
      city: normalizedCity2,
      distance: distance
    });

    this.cities.get(normalizedCity2).connections.push({
      city: normalizedCity1,
      distance: distance
    });
  }

  /**
   * Get nearby cities within a maximum distance
   * @param {string} cityName - Name of the city
   * @param {number} maxDistance - Maximum distance to search
   * @returns {Array} Array of nearby cities with distances
   * @throws {Error} If parameters are invalid or city doesn't exist
   */
  getNearbyCities(cityName, maxDistance) {
    if (!cityName || typeof cityName !== 'string') {
      throw new Error('City name must be a non-empty string');
    }

    if (typeof maxDistance !== 'number' || maxDistance <= 0) {
      throw new Error('Maximum distance must be a positive number');
    }

    const normalizedName = cityName.trim();
    if (!this.cities.has(normalizedName)) {
      throw new Error(`City "${normalizedName}" does not exist`);
    }

    const city = this.cities.get(normalizedName);
    return city.connections
      .filter(conn => conn.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .map(conn => ({
        city: conn.city,
        distance: conn.distance
      }));
  }

  /**
   * Get the distance between two cities
   * @param {string} city1 - First city name
   * @param {string} city2 - Second city name
   * @returns {number|null} Distance between cities or null if not connected
   */
  getDistance(city1, city2) {
    if (!city1 || !city2) {
      return null;
    }

    const normalizedCity1 = city1.trim();
    const normalizedCity2 = city2.trim();

    if (!this.cities.has(normalizedCity1) || !this.cities.has(normalizedCity2)) {
      return null;
    }

    const edgeKey = this.getEdgeKey(normalizedCity1, normalizedCity2);
    const edge = this.edges.get(edgeKey);

    return edge ? edge.distance : null;
  }

  /**
   * Get all cities in the graph
   * @returns {Array} Array of city names
   */
  getAllCities() {
    return Array.from(this.cities.keys());
  }

  /**
   * Get all connections for a specific city
   * @param {string} cityName - Name of the city
   * @returns {Array} Array of connections
   */
  getCityConnections(cityName) {
    if (!cityName || typeof cityName !== 'string') {
      return [];
    }

    const normalizedName = cityName.trim();
    const city = this.cities.get(normalizedName);

    return city ? [...city.connections] : [];
  }

  /**
   * Check if a city exists in the graph
   * @param {string} cityName - Name of the city
   * @returns {boolean} True if city exists
   */
  hasCity(cityName) {
    if (!cityName || typeof cityName !== 'string') {
      return false;
    }
    return this.cities.has(cityName.trim());
  }

  /**
   * Remove a city from the graph
   * @param {string} cityName - Name of the city to remove
   * @returns {boolean} True if city was removed
   */
  removeCity(cityName) {
    if (!cityName || typeof cityName !== 'string') {
      return false;
    }

    const normalizedName = cityName.trim();
    if (!this.cities.has(normalizedName)) {
      return false;
    }

    // Remove all edges connected to this city
    const city = this.cities.get(normalizedName);
    city.connections.forEach(conn => {
      const edgeKey = this.getEdgeKey(normalizedName, conn.city);
      this.edges.delete(edgeKey);

      // Remove connection from the other city
      const otherCity = this.cities.get(conn.city);
      if (otherCity) {
        otherCity.connections = otherCity.connections.filter(
          c => c.city !== normalizedName
        );
      }
    });

    this.cities.delete(normalizedName);
    return true;
  }

  /**
   * Get total number of cities
   * @returns {number} Number of cities
   */
  getCityCount() {
    return this.cities.size;
  }

  /**
   * Get total number of edges
   * @returns {number} Number of edges
   */
  getEdgeCount() {
    return this.edges.size;
  }

  /**
   * Clear all cities and edges
   */
  clear() {
    this.cities.clear();
    this.edges.clear();
  }

  /**
   * Get visualization data for the graph
   * @returns {Object} Graph data structure
   */
  toJSON() {
    return {
      cities: Array.from(this.cities.values()).map(city => ({
        name: city.name,
        connectionCount: city.connections.length
      })),
      edges: Array.from(this.edges.values())
    };
  }

  /**
   * Generate a unique key for an edge (order-independent)
   * @private
   */
  getEdgeKey(city1, city2) {
    return city1 < city2 ? `${city1}-${city2}` : `${city2}-${city1}`;
  }
}

module.exports = Graph;
