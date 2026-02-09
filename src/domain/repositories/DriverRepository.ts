import { Driver } from '../entities/Driver';

export interface DriverRepository {
  save(driver: Driver): Promise<Driver>;
  findById(id: string): Promise<Driver | null>;
  findAll(): Promise<Driver[]>;
  update(id: string, driver: Driver): Promise<Driver | null>;
  delete(id: string): Promise<boolean>;
  findByLicencia(licencia: string): Promise<Driver | null>;
}
