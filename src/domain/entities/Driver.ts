import { v7 as uuidv7 } from 'uuid';
import { ValidationException } from '../exceptions';
import { EmailValidator } from '../validators';

export class Driver {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly licencia: string,
    public readonly telefono: string,
    public readonly email: string,
    public readonly fechaNacimiento: Date,
    public readonly activo: boolean = true,
    public readonly fechaCreacion: Date = new Date(),
    public readonly fechaActualizacion: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new ValidationException('El nombre es requerido', 'nombre');
    }
    if (!this.apellido || this.apellido.trim().length === 0) {
      throw new ValidationException('El apellido es requerido', 'apellido');
    }
    if (!this.licencia || this.licencia.trim().length === 0) {
      throw new ValidationException('La licencia es requerida', 'licencia');
    }
    if (!EmailValidator.isValid(this.email)) {
      throw new ValidationException('El email no es válido', 'email');
    }
    if (!this.telefono || this.telefono.trim().length === 0) {
      throw new ValidationException('El teléfono es requerido', 'telefono');
    }
    if (!this.fechaNacimiento) {
      throw new ValidationException('La fecha de nacimiento es requerida', 'fechaNacimiento');
    }
  }

  public static create(
    nombre: string,
    apellido: string,
    licencia: string,
    telefono: string,
    email: string,
    fechaNacimiento: Date,
    id?: string
  ): Driver {
    return new Driver(
      id || this.generateId(),
      nombre,
      apellido,
      licencia,
      telefono,
      email,
      fechaNacimiento,
      true,
      new Date(),
      new Date()
    );
  }

  public update(data: Partial<{
    nombre: string;
    apellido: string;
    licencia: string;
    telefono: string;
    email: string;
    fechaNacimiento: Date;
    activo: boolean;
  }>): Driver {
    return new Driver(
      this.id,
      data.nombre ?? this.nombre,
      data.apellido ?? this.apellido,
      data.licencia ?? this.licencia,
      data.telefono ?? this.telefono,
      data.email ?? this.email,
      data.fechaNacimiento ?? this.fechaNacimiento,
      data.activo ?? this.activo,
      this.fechaCreacion,
      new Date()
    );
  }

  public toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      licencia: this.licencia,
      telefono: this.telefono,
      email: this.email,
      fechaNacimiento: this.fechaNacimiento,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  private static generateId(): string {
    return uuidv7();
  }
}
