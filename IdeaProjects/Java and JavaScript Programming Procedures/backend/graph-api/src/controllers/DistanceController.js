import { Distance } from '../models/Distance.js';

/**
 * Distance Controller - Handles HTTP requests for distance operations
 */
export class DistanceController {
  /**
   * Get all distances
   * GET /api/distances
   */
  static async getAllDistances(req, res) {
    try {
      const distances = await Distance.findAll();
      res.status(200).json({
        success: true,
        data: distances,
        count: distances.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving distances',
        error: error.message
      });
    }
  }

  /**
   * Get distance by ID
   * GET /api/distances/:id
   */
  static async getDistanceById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distance ID'
        });
      }

      const distance = await Distance.findById(parseInt(id));
      
      if (!distance) {
        return res.status(404).json({
          success: false,
          message: 'Distance not found'
        });
      }

      res.status(200).json({
        success: true,
        data: distance
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving distance',
        error: error.message
      });
    }
  }

  /**
   * Get distance between two cities by IDs
   * GET /api/distances/cities/:city1Id/:city2Id
   */
  static async getDistanceBetweenCities(req, res) {
    try {
      const { city1Id, city2Id } = req.params;
      
      if (!city1Id || isNaN(city1Id) || !city2Id || isNaN(city2Id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city IDs'
        });
      }

      const distance = await Distance.findBetweenCities(parseInt(city1Id), parseInt(city2Id));
      
      if (!distance) {
        return res.status(404).json({
          success: false,
          message: 'Distance not found between the specified cities'
        });
      }

      res.status(200).json({
        success: true,
        data: distance
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving distance',
        error: error.message
      });
    }
  }

  /**
   * Get distance between two cities by names
   * GET /api/distances/cities-by-name?city1=:city1Name&city2=:city2Name
   */
  static async getDistanceBetweenCitiesByName(req, res) {
    try {
      const { city1, city2 } = req.query;
      
      if (!city1 || !city2 || city1.trim() === '' || city2.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Both city names are required'
        });
      }

      const distance = await Distance.findBetweenCitiesByName(city1.trim(), city2.trim());
      
      if (!distance) {
        return res.status(404).json({
          success: false,
          message: `Distance not found between "${city1}" and "${city2}"`
        });
      }

      res.status(200).json({
        success: true,
        data: distance
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving distance',
        error: error.message
      });
    }
  }

  /**
   * Create new distance
   * POST /api/distances
   */
  static async createDistance(req, res) {
    try {
      const { city1Id, city2Id, distance, city1Name, city2Name } = req.body;

      // Validate distance
      const validation = Distance.validateDistance(distance);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distance',
          errors: validation.errors
        });
      }

      let result;

      if (city1Id && city2Id) {
        // Create by IDs
        if (isNaN(city1Id) || isNaN(city2Id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid city IDs'
          });
        }

        result = await Distance.create(parseInt(city1Id), parseInt(city2Id), validation.sanitizedDistance);
      } else if (city1Name && city2Name) {
        // Create by names
        if (city1Name.trim() === '' || city2Name.trim() === '') {
          return res.status(400).json({
            success: false,
            message: 'City names cannot be empty'
          });
        }

        result = await Distance.createByNames(city1Name.trim(), city2Name.trim(), validation.sanitizedDistance);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Either city IDs (city1Id, city2Id) or city names (city1Name, city2Name) are required'
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Distance created successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('already exists')) {
        const status = error.message.includes('not found') ? 404 : 409;
        res.status(status).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creating distance',
          error: error.message
        });
      }
    }
  }

  /**
   * Update distance
   * PUT /api/distances/:id
   */
  static async updateDistance(req, res) {
    try {
      const { id } = req.params;
      const { distance } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distance ID'
        });
      }

      // Validate distance
      const validation = Distance.validateDistance(distance);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distance',
          errors: validation.errors
        });
      }

      const success = await Distance.update(parseInt(id), validation.sanitizedDistance);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Distance not found'
        });
      }

      // Return updated distance
      const updatedDistance = await Distance.findById(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: 'Distance updated successfully',
        data: updatedDistance
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error updating distance',
          error: error.message
        });
      }
    }
  }

  /**
   * Delete distance
   * DELETE /api/distances/:id
   */
  static async deleteDistance(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid distance ID'
        });
      }

      const success = await Distance.delete(parseInt(id));
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Distance not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Distance deleted successfully'
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error deleting distance',
          error: error.message
        });
      }
    }
  }

  /**
   * Get connections for a city
   * GET /api/distances/city/:cityId/connections
   */
  static async getCityConnections(req, res) {
    try {
      const { cityId } = req.params;
      
      if (!cityId || isNaN(cityId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city ID'
        });
      }

      const connections = await Distance.getCityConnections(parseInt(cityId));
      
      res.status(200).json({
        success: true,
        data: connections,
        count: connections.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving city connections',
        error: error.message
      });
    }
  }

  /**
   * Get nearby cities within maximum distance
   * GET /api/distances/city/:cityId/nearby?maxDistance=:maxDistance
   */
  static async getNearbyCities(req, res) {
    try {
      const { cityId } = req.params;
      const { maxDistance } = req.query;
      
      if (!cityId || isNaN(cityId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid city ID'
        });
      }

      if (!maxDistance || isNaN(maxDistance) || maxDistance <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid maximum distance is required'
        });
      }

      const nearbyCities = await Distance.getNearbyCities(parseInt(cityId), parseFloat(maxDistance));
      
      res.status(200).json({
        success: true,
        data: nearbyCities,
        count: nearbyCities.length,
        maxDistance: parseFloat(maxDistance)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving nearby cities',
        error: error.message
      });
    }
  }

  /**
   * Get nearby cities by city name
   * GET /api/distances/city-name/:cityName/nearby?maxDistance=:maxDistance
   */
  static async getNearbyCitiesByName(req, res) {
    try {
      const { cityName } = req.params;
      const { maxDistance } = req.query;
      
      if (!cityName || cityName.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'City name is required'
        });
      }

      if (!maxDistance || isNaN(maxDistance) || maxDistance <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid maximum distance is required'
        });
      }

      const nearbyCities = await Distance.getNearbyCitiesByName(cityName.trim(), parseFloat(maxDistance));
      
      res.status(200).json({
        success: true,
        data: nearbyCities,
        count: nearbyCities.length,
        cityName: cityName.trim(),
        maxDistance: parseFloat(maxDistance)
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error retrieving nearby cities',
          error: error.message
        });
      }
    }
  }

  /**
   * Get distance statistics
   * GET /api/distances/stats
   */
  static async getDistanceStatistics(req, res) {
    try {
      const stats = await Distance.getStatistics();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving distance statistics',
        error: error.message
      });
    }
  }

  /**
   * Get all routes for graph visualization
   * GET /api/distances/routes
   */
  static async getAllRoutes(req, res) {
    try {
      const routes = await Distance.getAllRoutes();
      
      res.status(200).json({
        success: true,
        data: routes,
        count: routes.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving routes',
        error: error.message
      });
    }
  }
}