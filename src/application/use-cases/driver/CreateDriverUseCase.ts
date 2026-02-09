import { Driver } from '../../../domain/entities/Driver';
import { DriverRepository } from '../../../domain/repositories/DriverRepository';
import { DuplicateLicenseException } from '../../../domain/exceptions';
import { CreateDriverDTO } from '../../dtos/driver';

export class CreateDriverUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(dto: CreateDriverDTO): Promise<Driver> {
    // Verificar si ya existe un conductor con la misma licencia
    const existingDriver = await this.driverRepository.findByLicencia(dto.licencia);
    if (existingDriver) {
      throw new DuplicateLicenseException(dto.licencia);
    }

    const driver = Driver.create(
      dto.nombre,
      dto.apellido,
      dto.licencia,
      dto.telefono,
      dto.email,
      dto.fechaNacimiento
    );

    return await this.driverRepository.save(driver);
  }
}
