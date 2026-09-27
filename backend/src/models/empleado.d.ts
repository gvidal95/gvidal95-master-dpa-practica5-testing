import type { Model } from 'mongoose';

interface EmpleadoDocument {
    nombre: string;
    cargo: string;
    departamento: string;
    sueldo: number;
}

declare const Empleado: Model<EmpleadoDocument>;

export default Empleado;
