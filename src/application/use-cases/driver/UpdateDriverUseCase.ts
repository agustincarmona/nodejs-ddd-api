import { Driver } from '../../../domain/entities/Driver';
import { DriverRepository } from '../../../domain/repositories/DriverRepository';
import { DuplicateLicenseException, DriverNotFoundException, DriverUpdateException } from '../../../domain/exceptions';
import { UpdateDriverDTO } from '../../dtos/driver';

export class UpdateDriverUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(id: string, dto: UpdateDriverDTO): Promise<Driver> {
    const existingDriver = await this.driverRepository.findById(id);
    if (!existingDriver) {
      throw new DriverNotFoundException(id);
    }

    // Si se actualiza la licencia, verificar que no exista otro conductor con esa licencia
    if (dto.licencia && dto.licencia !== existingDriver.licencia) {
      const driverWithLicencia = await this.driverRepository.findByLicencia(dto.licencia);
      if (driverWithLicencia) {
        throw new DuplicateLicenseException(dto.licencia);
      }
    }

    const updatedDriver = existingDriver.update(dto);
    const result = await this.driverRepository.update(id, updatedDriver);
    
    if (!result) {
      throw new DriverUpdateException(id);
    }

    return result;
  }
}
