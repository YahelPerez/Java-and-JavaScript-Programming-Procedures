import express from 'express';
import { CityController } from '../controllers/CityController.js';

const router = express.Router();

// City routes
router.get('/', CityController.getAllCities);
router.get('/search', CityController.searchCities);
router.get('/stats', CityController.getCityStatistics);
router.get('/connections', CityController.getCitiesWithConnections);
router.get('/:id', CityController.getCityById);
router.post('/', CityController.createCity);
router.put('/:id', CityController.updateCity);
router.delete('/:id', CityController.deleteCity);

export default router;