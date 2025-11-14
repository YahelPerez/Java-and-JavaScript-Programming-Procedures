import { executeQuery } from '../config/database.js';

/**
 * City Model - Handles database operations for cities
 */
export class City {
  constructor(id = null, name = null, createdAt = null, updatedAt = null) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Get all cities
   * @returns {Promise<Array>} Array of cities
   */
  static async findAll() {
    const query = 'SELECT * FROM cities ORDER BY name ASC';
    return await executeQuery(query);
  }

  /**
   * Get city by ID
   * @param {number} id - City ID
   * @returns {Promise<Object|null>} City object or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM cities WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get city by name
   * @param {string} name - City name
   * @returns {Promise<Object|null>} City object or null
   */
  static async findByName(name) {
    const query = 'SELECT * FROM cities WHERE name = ?';
    const results = await executeQuery(query, [name]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create new city
   * @param {string} name - City name
   * @returns {Promise<Object>} Created city with ID
   */
  static async create(name) {
    // Check if city already exists
    const existing = await City.findByName(name);
    if (existing) {
      throw new Error(`City "${name}" already exists`);
    }

    const query = 'INSERT INTO cities (name) VALUES (?)';
    const result = await executeQuery(query, [name]);
    
    return {
      id: result.insertId,
      name: name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Update city name
   * @param {number} id - City ID
   * @param {string} name - New city name
   * @returns {Promise<boolean>} Success status
   */
  static async update(id, name) {
    // Check if city exists
    const existing = await City.findById(id);
    if (!existing) {
      throw new Error(`City with ID ${id} not found`);
    }

    // Check if new name conflicts with existing city
    const conflicting = await City.findByName(name);
    if (conflicting && conflicting.id !== id) {
      throw new Error(`City "${name}" already exists`);
    }

    const query = 'UPDATE cities SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeQuery(query, [name, id]);
    return result.affectedRows > 0;
  }

  /**
   * Delete city and all its distances
   * @param {number} id - City ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // Check if city exists
    const existing = await City.findById(id);
    if (!existing) {
      throw new Error(`City with ID ${id} not found`);
    }

    // Delete distances first (foreign key constraint)
    await executeQuery('DELETE FROM distances WHERE city1_id = ? OR city2_id = ?', [id, id]);
    
    // Delete city
    const query = 'DELETE FROM cities WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Get city statistics
   * @returns {Promise<Array>} Array of city stats
   */
  static async getStatistics() {
    const query = `
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT CASE WHEN d.city1_id = c.id THEN d.city2_id 
                           WHEN d.city2_id = c.id THEN d.city1_id END) as connections_count,
        ROUND(AVG(d.distance), 2) as avg_distance,
        MIN(d.distance) as min_distance,
        MAX(d.distance) as max_distance
      FROM cities c
      LEFT JOIN distances d ON c.id = d.city1_id OR c.id = d.city2_id
      GROUP BY c.id, c.name
      ORDER BY connections_count DESC, c.name ASC
    `;
    return await executeQuery(query);
  }

  /**
   * Search cities by name (partial match)
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching cities
   */
  static async search(searchTerm) {
    const query = 'SELECT * FROM cities WHERE name LIKE ? ORDER BY name ASC';
    return await executeQuery(query, [`%${searchTerm}%`]);
  }

  /**
   * Get cities with their connection count
   * @returns {Promise<Array>} Array of cities with connection counts
   */
  static async findAllWithConnections() {
    const query = `
      SELECT 
        c.*,
        COUNT(DISTINCT CASE WHEN d.city1_id = c.id THEN d.city2_id 
                           WHEN d.city2_id = c.id THEN d.city1_id END) as connection_count
      FROM cities c
      LEFT JOIN distances d ON c.id = d.city1_id OR c.id = d.city2_id
      GROUP BY c.id, c.name, c.created_at, c.updated_at
      ORDER BY connection_count DESC, c.name ASC
    `;
    return await executeQuery(query);
  }

  /**
   * Validate city name
   * @param {string} name - City name to validate
   * @returns {Object} Validation result
   */
  static validateName(name) {
    const errors = [];

    if (!name || typeof name !== 'string') {
      errors.push('City name must be a non-empty string');
    } else {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        errors.push('City name cannot be empty or whitespace');
      }
      if (trimmedName.length > 100) {
        errors.push('City name cannot exceed 100 characters');
      }
      if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(trimmedName)) {
        errors.push('City name contains invalid characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      sanitizedName: name ? name.trim() : null
    };
  }
}