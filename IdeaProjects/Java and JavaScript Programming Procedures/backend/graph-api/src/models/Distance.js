import { executeQuery } from '../config/database.js';
import { City } from './City.js';

/**
 * Distance Model - Handles database operations for distances between cities
 */
export class Distance {
  constructor(id = null, city1Id = null, city2Id = null, distance = null, createdAt = null, updatedAt = null) {
    this.id = id;
    this.city1Id = city1Id;
    this.city2Id = city2Id;
    this.distance = distance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Get all distances with city names
   * @returns {Promise<Array>} Array of distances with city names
   */
  static async findAll() {
    const query = `
      SELECT 
        d.id,
        d.city1_id,
        d.city2_id,
        d.distance,
        d.created_at,
        d.updated_at,
        c1.name as city1_name,
        c2.name as city2_name
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      ORDER BY d.distance ASC
    `;
    return await executeQuery(query);
  }

  /**
   * Get distance by ID
   * @param {number} id - Distance ID
   * @returns {Promise<Object|null>} Distance object or null
   */
  static async findById(id) {
    const query = `
      SELECT 
        d.id,
        d.city1_id,
        d.city2_id,
        d.distance,
        d.created_at,
        d.updated_at,
        c1.name as city1_name,
        c2.name as city2_name
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      WHERE d.id = ?
    `;
    const results = await executeQuery(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get distance between two cities
   * @param {number} city1Id - First city ID
   * @param {number} city2Id - Second city ID
   * @returns {Promise<Object|null>} Distance object or null
   */
  static async findBetweenCities(city1Id, city2Id) {
    const query = `
      SELECT 
        d.id,
        d.city1_id,
        d.city2_id,
        d.distance,
        d.created_at,
        d.updated_at,
        c1.name as city1_name,
        c2.name as city2_name
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      WHERE (d.city1_id = ? AND d.city2_id = ?) OR (d.city1_id = ? AND d.city2_id = ?)
    `;
    const results = await executeQuery(query, [city1Id, city2Id, city2Id, city1Id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get distance between two cities by names
   * @param {string} city1Name - First city name
   * @param {string} city2Name - Second city name
   * @returns {Promise<Object|null>} Distance object or null
   */
  static async findBetweenCitiesByName(city1Name, city2Name) {
    const query = `
      SELECT 
        d.id,
        d.city1_id,
        d.city2_id,
        d.distance,
        d.created_at,
        d.updated_at,
        c1.name as city1_name,
        c2.name as city2_name
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      WHERE (c1.name = ? AND c2.name = ?) OR (c1.name = ? AND c2.name = ?)
    `;
    const results = await executeQuery(query, [city1Name, city2Name, city2Name, city1Name]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create new distance between cities
   * @param {number} city1Id - First city ID
   * @param {number} city2Id - Second city ID
   * @param {number} distance - Distance value
   * @returns {Promise<Object>} Created distance object
   */
  static async create(city1Id, city2Id, distance) {
    // Validate cities exist
    const city1 = await City.findById(city1Id);
    const city2 = await City.findById(city2Id);
    
    if (!city1) throw new Error(`City with ID ${city1Id} not found`);
    if (!city2) throw new Error(`City with ID ${city2Id} not found`);
    if (city1Id === city2Id) throw new Error('Cannot create distance from a city to itself');

    // Check if distance already exists
    const existing = await Distance.findBetweenCities(city1Id, city2Id);
    if (existing) {
      throw new Error(`Distance between "${city1.name}" and "${city2.name}" already exists`);
    }

    // Ensure consistent ordering (smaller ID first)
    const minId = Math.min(city1Id, city2Id);
    const maxId = Math.max(city1Id, city2Id);

    const query = 'INSERT INTO distances (city1_id, city2_id, distance) VALUES (?, ?, ?)';
    const result = await executeQuery(query, [minId, maxId, distance]);
    
    return {
      id: result.insertId,
      city1Id: minId,
      city2Id: maxId,
      distance: distance,
      city1Name: minId === city1Id ? city1.name : city2.name,
      city2Name: maxId === city2Id ? city2.name : city1.name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Create distance using city names
   * @param {string} city1Name - First city name
   * @param {string} city2Name - Second city name
   * @param {number} distance - Distance value
   * @returns {Promise<Object>} Created distance object
   */
  static async createByNames(city1Name, city2Name, distance) {
    const city1 = await City.findByName(city1Name);
    const city2 = await City.findByName(city2Name);
    
    if (!city1) throw new Error(`City "${city1Name}" not found`);
    if (!city2) throw new Error(`City "${city2Name}" not found`);
    
    return await Distance.create(city1.id, city2.id, distance);
  }

  /**
   * Update distance
   * @param {number} id - Distance ID
   * @param {number} distance - New distance value
   * @returns {Promise<boolean>} Success status
   */
  static async update(id, distance) {
    const existing = await Distance.findById(id);
    if (!existing) {
      throw new Error(`Distance with ID ${id} not found`);
    }

    const query = 'UPDATE distances SET distance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeQuery(query, [distance, id]);
    return result.affectedRows > 0;
  }

  /**
   * Delete distance
   * @param {number} id - Distance ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    const existing = await Distance.findById(id);
    if (!existing) {
      throw new Error(`Distance with ID ${id} not found`);
    }

    const query = 'DELETE FROM distances WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get all connections for a city
   * @param {number} cityId - City ID
   * @returns {Promise<Array>} Array of connected cities with distances
   */
  static async getCityConnections(cityId) {
    const query = `
      SELECT 
        d.id as distance_id,
        d.distance,
        CASE 
          WHEN d.city1_id = ? THEN c2.id 
          ELSE c1.id 
        END as connected_city_id,
        CASE 
          WHEN d.city1_id = ? THEN c2.name 
          ELSE c1.name 
        END as connected_city_name,
        d.created_at,
        d.updated_at
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      WHERE d.city1_id = ? OR d.city2_id = ?
      ORDER BY d.distance ASC
    `;
    return await executeQuery(query, [cityId, cityId, cityId, cityId]);
  }

  /**
   * Get nearby cities within a maximum distance
   * @param {number} cityId - City ID
   * @param {number} maxDistance - Maximum distance
   * @returns {Promise<Array>} Array of nearby cities
   */
  static async getNearbyCities(cityId, maxDistance) {
    const query = `
      SELECT 
        d.id as distance_id,
        d.distance,
        CASE 
          WHEN d.city1_id = ? THEN c2.id 
          ELSE c1.id 
        END as nearby_city_id,
        CASE 
          WHEN d.city1_id = ? THEN c2.name 
          ELSE c1.name 
        END as nearby_city_name
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      WHERE (d.city1_id = ? OR d.city2_id = ?) 
        AND d.distance <= ?
      ORDER BY d.distance ASC
    `;
    return await executeQuery(query, [cityId, cityId, cityId, cityId, maxDistance]);
  }

  /**
   * Get nearby cities by city name
   * @param {string} cityName - City name
   * @param {number} maxDistance - Maximum distance
   * @returns {Promise<Array>} Array of nearby cities
   */
  static async getNearbyCitiesByName(cityName, maxDistance) {
    const city = await City.findByName(cityName);
    if (!city) {
      throw new Error(`City "${cityName}" not found`);
    }
    return await Distance.getNearbyCities(city.id, maxDistance);
  }

  /**
   * Get distance statistics
   * @returns {Promise<Object>} Distance statistics
   */
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_distances,
        ROUND(AVG(distance), 2) as avg_distance,
        MIN(distance) as min_distance,
        MAX(distance) as max_distance,
        ROUND(STDDEV(distance), 2) as std_deviation
      FROM distances
    `;
    const results = await executeQuery(query);
    return results[0];
  }

  /**
   * Validate distance value
   * @param {number} distance - Distance to validate
   * @returns {Object} Validation result
   */
  static validateDistance(distance) {
    const errors = [];

    if (distance === null || distance === undefined) {
      errors.push('Distance is required');
    } else {
      const numDistance = Number(distance);
      if (isNaN(numDistance)) {
        errors.push('Distance must be a valid number');
      } else if (!isFinite(numDistance)) {
        errors.push('Distance must be a finite number');
      } else if (numDistance <= 0) {
        errors.push('Distance must be a positive number');
      } else if (numDistance > 50000) {
        errors.push('Distance cannot exceed 50,000 kilometers');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      sanitizedDistance: distance ? Number(distance) : null
    };
  }

  /**
   * Get all routes (for graph visualization)
   * @returns {Promise<Array>} Array of routes for graph visualization
   */
  static async getAllRoutes() {
    const query = `
      SELECT 
        c1.name as source,
        c2.name as target,
        d.distance as weight,
        d.id as route_id
      FROM distances d
      JOIN cities c1 ON d.city1_id = c1.id
      JOIN cities c2 ON d.city2_id = c2.id
      ORDER BY c1.name, c2.name
    `;
    return await executeQuery(query);
  }
}