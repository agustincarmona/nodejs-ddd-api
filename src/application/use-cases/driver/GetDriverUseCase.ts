import { Driver } from '../../../domain/entities/Driver';
import { DriverRepository } from '../../../domain/repositories/DriverRepository';
import { DriverNotFoundException } from '../../../domain/exceptions';

export class GetDriverUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException(id);
    }
    return driver;
  }
}
