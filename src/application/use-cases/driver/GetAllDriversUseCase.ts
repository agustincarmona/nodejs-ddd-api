import { Driver } from '../../../domain/entities/Driver';
import { DriverRepository } from '../../../domain/repositories/DriverRepository';

export class GetAllDriversUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(): Promise<Driver[]> {
    return await this.driverRepository.findAll();
  }
}
