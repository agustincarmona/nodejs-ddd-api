import { Request, Response } from 'express';
import { DriverController } from '../../../src/infrastructure/api/controllers/DriverController';
import { CreateDriverUseCase } from '../../../src/application/use-cases/driver/CreateDriverUseCase';
import { GetDriverUseCase } from '../../../src/application/use-cases/driver/GetDriverUseCase';
import { GetAllDriversUseCase } from '../../../src/application/use-cases/driver/GetAllDriversUseCase';
import { UpdateDriverUseCase } from '../../../src/application/use-cases/driver/UpdateDriverUseCase';
import { DeleteDriverUseCase } from '../../../src/application/use-cases/driver/DeleteDriverUseCase';
import {
  DriverUpdateException,
  DriverDeleteException,
} from '../../../src/domain/exceptions';

describe('DriverController Unit Tests - Error Handling', () => {
  let controller: DriverController;
  let mockCreateUseCase: jest.Mocked<CreateDriverUseCase>;
  let mockGetUseCase: jest.Mocked<GetDriverUseCase>;
  let mockGetAllUseCase: jest.Mocked<GetAllDriversUseCase>;
  let mockUpdateUseCase: jest.Mocked<UpdateDriverUseCase>;
  let mockDeleteUseCase: jest.Mocked<DeleteDriverUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    // Mock use cases
    mockCreateUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetAllUseCase = {
      execute: jest.fn(),
    } as any;

    mockUpdateUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteUseCase = {
      execute: jest.fn(),
    } as any;

    // Mock response
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };

    controller = new DriverController(
      mockCreateUseCase,
      mockGetUseCase,
      mockGetAllUseCase,
      mockUpdateUseCase,
      mockDeleteUseCase
    );
  });

  describe('create', () => {
    it('should handle generic Error', async () => {
      mockRequest = {
        body: {
          nombre: 'Juan',
          apellido: 'Pérez',
          licencia: 'ABC123',
          telefono: '123456',
          email: 'test@test.com',
          fechaNacimiento: '1990-01-01',
        },
      };

      const genericError = new Error('Generic error');
      mockCreateUseCase.execute.mockRejectedValue(genericError);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Generic error' });
    });

    it('should handle non-Error exceptions with 500', async () => {
      mockRequest = {
        body: {
          nombre: 'Juan',
          apellido: 'Pérez',
          licencia: 'ABC123',
          telefono: '123456',
          email: 'test@test.com',
          fechaNacimiento: '1990-01-01',
        },
      };

      mockCreateUseCase.execute.mockRejectedValue('String error');

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  describe('getById', () => {
    it('should handle generic Error', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };

      const genericError = new Error('Database connection error');
      mockGetUseCase.execute.mockRejectedValue(genericError);

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Database connection error' });
    });

    it('should handle non-Error exceptions with 500', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };

      mockGetUseCase.execute.mockRejectedValue({ custom: 'error' });

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  describe('getAll', () => {
    it('should handle generic Error', async () => {
      mockRequest = {};

      const genericError = new Error('Connection timeout');
      mockGetAllUseCase.execute.mockRejectedValue(genericError);

      await controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Connection timeout' });
    });

    it('should handle non-Error exceptions with 500', async () => {
      mockRequest = {};

      mockGetAllUseCase.execute.mockRejectedValue(null);

      await controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  describe('update', () => {
    it('should handle DriverUpdateException', async () => {
      mockRequest = {
        params: { id: 'test-id' },
        body: { nombre: 'Updated' },
      };

      const updateException = new DriverUpdateException('test-id', 'Cannot update driver');
      mockUpdateUseCase.execute.mockRejectedValue(updateException);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: updateException.message });
    });

    it('should handle generic Error', async () => {
      mockRequest = {
        params: { id: 'test-id' },
        body: { nombre: 'Updated' },
      };

      const genericError = new Error('Unexpected error');
      mockUpdateUseCase.execute.mockRejectedValue(genericError);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Unexpected error' });
    });

    it('should handle non-Error exceptions with 500', async () => {
      mockRequest = {
        params: { id: 'test-id' },
        body: { nombre: 'Updated' },
      };

      mockUpdateUseCase.execute.mockRejectedValue(undefined);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  describe('delete', () => {
    it('should handle DriverDeleteException', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };

      const deleteException = new DriverDeleteException('test-id', 'Cannot delete driver');
      mockDeleteUseCase.execute.mockRejectedValue(deleteException);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: deleteException.message });
    });

    it('should handle generic Error', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };

      const genericError = new Error('Foreign key constraint');
      mockDeleteUseCase.execute.mockRejectedValue(genericError);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Foreign key constraint' });
    });

    it('should handle non-Error exceptions with 500', async () => {
      mockRequest = {
        params: { id: 'test-id' },
      };

      mockDeleteUseCase.execute.mockRejectedValue(123);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
});
