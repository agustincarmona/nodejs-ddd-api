import { DriverRepository } from '../../../domain/repositories/DriverRepository';
import { DriverNotFoundException, DriverDeleteException } from '../../../domain/exceptions';

export class DeleteDriverUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(id: string): Promise<void> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new DriverNotFoundException(id);
    }

    const deleted = await this.driverRepository.delete(id);
    if (!deleted) {
      throw new DriverDeleteException(id);
    }
  }
}
