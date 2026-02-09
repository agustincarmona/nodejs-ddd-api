import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';

export function createDriverRoutes(controller: DriverController): Router {
  const router = Router();

  router.post('/conductores', (req, res) => controller.create(req, res));
  router.get('/conductores', (req, res) => controller.getAll(req, res));
  router.get('/conductores/:id', (req, res) => controller.getById(req, res));
  router.put('/conductores/:id', (req, res) => controller.update(req, res));
  router.delete('/conductores/:id', (req, res) => controller.delete(req, res));

  return router;
}
