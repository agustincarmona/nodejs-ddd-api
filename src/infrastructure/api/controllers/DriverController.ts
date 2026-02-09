import { Request, Response } from 'express';
import { CreateDriverUseCase } from '../../../application/use-cases/driver/CreateDriverUseCase';
import { GetDriverUseCase } from '../../../application/use-cases/driver/GetDriverUseCase';
import { GetAllDriversUseCase } from '../../../application/use-cases/driver/GetAllDriversUseCase';
import { UpdateDriverUseCase } from '../../../application/use-cases/driver/UpdateDriverUseCase';
import { DeleteDriverUseCase } from '../../../application/use-cases/driver/DeleteDriverUseCase';
import { 
  DuplicateLicenseException, 
  DriverNotFoundException,
  DriverUpdateException,
  DriverDeleteException,
  ValidationException
} from '../../../domain/exceptions';

export class DriverController {
  constructor(
    private createDriverUseCase: CreateDriverUseCase,
    private getDriverUseCase: GetDriverUseCase,
    private getAllDriversUseCase: GetAllDriversUseCase,
    private updateDriverUseCase: UpdateDriverUseCase,
    private deleteDriverUseCase: DeleteDriverUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, apellido, licencia, telefono, email, fechaNacimiento } = req.body;

      if (!nombre || !apellido || !licencia || !telefono || !email || !fechaNacimiento) {
        res.status(400).json({ 
          error: 'Todos los campos son requeridos',
          campos: ['nombre', 'apellido', 'licencia', 'telefono', 'email', 'fechaNacimiento']
        });
        return;
      }

      const driver = await this.createDriverUseCase.execute({
        nombre,
        apellido,
        licencia,
        telefono,
        email,
        fechaNacimiento: new Date(fechaNacimiento),
      });

      res.status(201).json(driver.toPlainObject());
    } catch (error) {
      if (error instanceof DuplicateLicenseException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message, field: error.field });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const driver = await this.getDriverUseCase.execute(id);
      res.status(200).json(driver.toPlainObject());
    } catch (error) {
      if (error instanceof DriverNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const drivers = await this.getAllDriversUseCase.execute();
      res.status(200).json(drivers.map(driver => driver.toPlainObject()));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.fechaNacimiento) {
        updateData.fechaNacimiento = new Date(updateData.fechaNacimiento);
      }

      const driver = await this.updateDriverUseCase.execute(id, updateData);
      res.status(200).json(driver.toPlainObject());
    } catch (error) {
      if (error instanceof DriverNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof DuplicateLicenseException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message, field: error.field });
      } else if (error instanceof DriverUpdateException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteDriverUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof DriverNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof DriverDeleteException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}
