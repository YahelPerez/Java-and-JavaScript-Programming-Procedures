import { City } from '../models/City.js';

/**
 * City Controller - Handles HTTP requests for city operations
 */
export class CityController {
  /**
   * Get all cities
   * GET /api/cities
   */
  static async getAllCities(req, res) {
    try {
      const cities = await City.findAll();
      res.status(200).json({
        success: true,
        data: cities,
        count: cities.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving cities',
        error: error.message
      });
    }
  }

  /**
   * Get city by ID
   * GET /api/cities/:id
   */
  static async getCityById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city ID'
        });
      }

      const city = await City.findById(parseInt(id));
      
      if (!city) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      res.status(200).json({
        success: true,
        data: city
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving city',
        error: error.message
      });
    }
  }

  /**
   * Create new city
   * POST /api/cities
   */
  static async createCity(req, res) {
    try {
      const { name, latitude, longitude } = req.body;

      // Validate input
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'City name is required'
        });
      }

      const validation = City.validateName(name);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city name',
          errors: validation.errors
        });
      }

      // Validate coordinates if provided
      if (latitude !== undefined) {
        const latNum = Number(latitude);
        if (isNaN(latNum) || latNum < -90 || latNum > 90) {
          return res.status(400).json({
            success: false,
            message: 'Latitude must be a number between -90 and 90'
          });
        }
      }

      if (longitude !== undefined) {
        const lngNum = Number(longitude);
        if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
          return res.status(400).json({
            success: false,
            message: 'Longitude must be a number between -180 and 180'
          });
        }
      }

      const city = await City.create(name.trim(), latitude, longitude);
      
      res.status(201).json({
        success: true,
        message: 'City created successfully',
        data: city
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creating city',
          error: error.message
        });
      }
    }
  }

  /**
   * Update city
   * PUT /api/cities/:id
   */
  static async updateCity(req, res) {
    try {
      const { id } = req.params;
      const { name, latitude, longitude } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city ID'
        });
      }

      // Check if city exists
      const existingCity = await City.findById(parseInt(id));
      if (!existingCity) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      // Validate input
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'City name is required'
        });
      }

      const validation = City.validateName(name);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city name',
          errors: validation.errors
        });
      }

      // Validate coordinates if provided
      if (latitude !== undefined) {
        const latNum = Number(latitude);
        if (isNaN(latNum) || latNum < -90 || latNum > 90) {
          return res.status(400).json({
            success: false,
            message: 'Latitude must be a number between -90 and 90'
          });
        }
      }

      if (longitude !== undefined) {
        const lngNum = Number(longitude);
        if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
          return res.status(400).json({
            success: false,
            message: 'Longitude must be a number between -180 and 180'
          });
        }
      }

      const success = await City.update(parseInt(id), name.trim(), latitude, longitude);
      
      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update city'
        });
      }

      // Return updated city
      const updatedCity = await City.findById(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'City updated successfully',
        data: updatedCity
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error updating city',
          error: error.message
        });
      }
    }
  }

  /**
   * Delete city
   * DELETE /api/cities/:id
   */
  static async deleteCity(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city ID'
        });
      }

      const success = await City.delete(parseInt(id));
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'City not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'City deleted successfully'
      });
    } catch (error) {
      if (error.message.includes('has connections')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error deleting city',
          error: error.message
        });
      }
    }
  }

  /**
   * Search cities by name
   * GET /api/cities/search?q=:searchTerm
   */
  static async searchCities(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const cities = await City.search(q.trim());
      
      res.status(200).json({
        success: true,
        data: cities,
        count: cities.length,
        searchTerm: q.trim()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching cities',
        error: error.message
      });
    }
  }

  /**
   * Get city statistics
   * GET /api/cities/stats
   */
  static async getCityStatistics(req, res) {
    try {
      const stats = await City.getStatistics();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving city statistics',
        error: error.message
      });
    }
  }

  /**
   * Get cities with connections
   * GET /api/cities/connections
   */
  static async getCitiesWithConnections(req, res) {
    try {
      const cities = await City.findAllWithConnections();
      
      res.status(200).json({
        success: true,
        data: cities,
        count: cities.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving cities with connections',
        error: error.message
      });
    }
  }
}