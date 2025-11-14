import express from 'express';
import { DistanceController } from '../controllers/DistanceController.js';

const router = express.Router();

// Distance routes
router.get('/', DistanceController.getAllDistances);
router.get('/stats', DistanceController.getDistanceStatistics);
router.get('/routes', DistanceController.getAllRoutes);
router.get('/cities-by-name', DistanceController.getDistanceBetweenCitiesByName);
router.get('/cities/:city1Id/:city2Id', DistanceController.getDistanceBetweenCities);
router.get('/city/:cityId/connections', DistanceController.getCityConnections);
router.get('/city/:cityId/nearby', DistanceController.getNearbyCities);
router.get('/city-name/:cityName/nearby', DistanceController.getNearbyCitiesByName);
router.get('/:id', DistanceController.getDistanceById);
router.post('/', DistanceController.createDistance);
router.put('/:id', DistanceController.updateDistance);
router.delete('/:id', DistanceController.deleteDistance);

export default router;