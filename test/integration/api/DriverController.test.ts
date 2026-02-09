import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../../src/infrastructure/api/app';
import { setupTestDatabase, teardownTestDatabase, clearDatabase } from '../../helpers/testDatabase';

describe('Driver API Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/conductores', () => {
    it('should create a new driver with valid data', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const response = await request(app)
        .post('/api/conductores')
        .send(driverData)
        .expect(201);

      expect(response.body).toMatchObject({
        nombre: driverData.nombre,
        apellido: driverData.apellido,
        licencia: driverData.licencia,
        telefono: driverData.telefono,
        email: driverData.email,
        activo: true,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('fechaCreacion');
      expect(response.body).toHaveProperty('fechaActualizacion');
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteData = {
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const response = await request(app)
        .post('/api/conductores')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('requeridos');
    });

    it('should return 400 when email is invalid', async () => {
      const invalidData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'invalid-email',
        fechaNacimiento: '1985-05-15',
      };

      const response = await request(app)
        .post('/api/conductores')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('should return 400 when driver with same license already exists', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      await request(app).post('/api/conductores').send(driverData).expect(201);

      const duplicateData = {
        ...driverData,
        email: 'otro.email@example.com',
      };

      const response = await request(app)
        .post('/api/conductores')
        .send(duplicateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('licencia');
    });
  });

  describe('GET /api/conductores', () => {
    it('should return an empty array when no drivers exist', async () => {
      const response = await request(app).get('/api/conductores').expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all drivers', async () => {
      const drivers = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          licencia: 'ABC123456',
          telefono: '+34612345678',
          email: 'juan.perez@example.com',
          fechaNacimiento: '1985-05-15',
        },
        {
          nombre: 'María',
          apellido: 'García',
          licencia: 'DEF789012',
          telefono: '+34698765432',
          email: 'maria.garcia@example.com',
          fechaNacimiento: '1990-08-20',
        },
      ];

      for (const driver of drivers) {
        await request(app).post('/api/conductores').send(driver);
      }

      const response = await request(app).get('/api/conductores').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[1]).toHaveProperty('id');
    });
  });

  describe('GET /api/conductores/:id', () => {
    it('should return a driver by id', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const createResponse = await request(app)
        .post('/api/conductores')
        .send(driverData);

      const driverId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/conductores/${driverId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: driverId,
        nombre: driverData.nombre,
        apellido: driverData.apellido,
        licencia: driverData.licencia,
      });
    });

    it('should return 404 when driver does not exist', async () => {
      const response = await request(app)
        .get('/api/conductores/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('no encontrado');
    });
  });

  describe('PUT /api/conductores/:id', () => {
    it('should update a driver', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const createResponse = await request(app)
        .post('/api/conductores')
        .send(driverData);

      const driverId = createResponse.body.id;

      const updateData = {
        nombre: 'Juan Carlos',
        telefono: '+34611111111',
      };

      const response = await request(app)
        .put(`/api/conductores/${driverId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: driverId,
        nombre: updateData.nombre,
        apellido: driverData.apellido,
        telefono: updateData.telefono,
        licencia: driverData.licencia,
      });
    });

    it('should return 404 when updating non-existent driver', async () => {
      const updateData = {
        nombre: 'Juan Carlos',
      };

      const response = await request(app)
        .put('/api/conductores/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('no encontrado');
    });

    it('should return 400 when updating with invalid email', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const createResponse = await request(app)
        .post('/api/conductores')
        .send(driverData);

      const driverId = createResponse.body.id;

      const updateData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .put(`/api/conductores/${driverId}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('should return 400 when updating with duplicate license', async () => {
      const driver1 = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const driver2 = {
        nombre: 'María',
        apellido: 'García',
        licencia: 'DEF789012',
        telefono: '+34698765432',
        email: 'maria.garcia@example.com',
        fechaNacimiento: '1990-08-20',
      };

      await request(app).post('/api/conductores').send(driver1);
      const response2 = await request(app).post('/api/conductores').send(driver2);

      const driver2Id = response2.body.id;

      const updateData = {
        licencia: 'ABC123456', // License from driver1
      };

      const response = await request(app)
        .put(`/api/conductores/${driver2Id}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('licencia');
    });
  });

  describe('PUT /api/conductores/:id', () => {
    it('should update a driver with fechaNacimiento', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const createResponse = await request(app)
        .post('/api/conductores')
        .send(driverData);

      const driverId = createResponse.body.id;

      const updateData = {
        nombre: 'Juan Carlos',
        fechaNacimiento: '1986-06-20',
      };

      const response = await request(app)
        .put(`/api/conductores/${driverId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: driverId,
        nombre: updateData.nombre,
      });
    });
  });

  describe('DELETE /api/conductores/:id', () => {
    it('should delete a driver', async () => {
      const driverData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        licencia: 'ABC123456',
        telefono: '+34612345678',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
      };

      const createResponse = await request(app)
        .post('/api/conductores')
        .send(driverData);

      const driverId = createResponse.body.id;

      await request(app).delete(`/api/conductores/${driverId}`).expect(204);

      await request(app).get(`/api/conductores/${driverId}`).expect(404);
    });

    it('should return 404 when deleting non-existent driver', async () => {
      const response = await request(app)
        .delete('/api/conductores/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('no encontrado');
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent').expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('no encontrada');
    });
  });
});
