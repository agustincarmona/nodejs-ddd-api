import express, { Application } from 'express';
import cors from 'cors';
import { createDriverRoutes } from './routes/driverRoutes';
import { DriverController } from './controllers/DriverController';
import { MongoDriverRepository } from '../persistence/mongodb/repositories/MongoDriverRepository';
import { CreateDriverUseCase } from '../../application/use-cases/driver/CreateDriverUseCase';
import { GetDriverUseCase } from '../../application/use-cases/driver/GetDriverUseCase';
import { GetAllDriversUseCase } from '../../application/use-cases/driver/GetAllDriversUseCase';
import { UpdateDriverUseCase } from '../../application/use-cases/driver/UpdateDriverUseCase';
import { DeleteDriverUseCase } from '../../application/use-cases/driver/DeleteDriverUseCase';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'API de Transporte funcionando correctamente' });
  });

  // Dependency injection
  const driverRepository = new MongoDriverRepository();
  
  const createDriverUseCase = new CreateDriverUseCase(driverRepository);
  const getDriverUseCase = new GetDriverUseCase(driverRepository);
  const getAllDriversUseCase = new GetAllDriversUseCase(driverRepository);
  const updateDriverUseCase = new UpdateDriverUseCase(driverRepository);
  const deleteDriverUseCase = new DeleteDriverUseCase(driverRepository);

  const driverController = new DriverController(
    createDriverUseCase,
    getDriverUseCase,
    getAllDriversUseCase,
    updateDriverUseCase,
    deleteDriverUseCase
  );

  // Routes
  app.use('/api', createDriverRoutes(driverController));

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  return app;
}
