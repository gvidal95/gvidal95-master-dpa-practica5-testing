import type { EmployeeRepositoryInterface } from './employee.repository.interface.js';
import Empleado from '../models/empleado.js';

export class MongoEmployeeRepository implements EmployeeRepositoryInterface {

    // Empleado por ID
    async getEmployeeById(employeeId: string): Promise<any> {
        const empleado = await Empleado.findById(employeeId);
        return empleado;
    }

    // Actualizar empleado
    async updateEmployee(employeeId: string, employeeData: any): Promise<any> {
        const empleado = await Empleado.findByIdAndUpdate(employeeId, employeeData);
        return empleado
    }

    // Eliminar empleado
    async deleteEmployee(employeeId: string): Promise<void> {
        await Empleado.findByIdAndDelete(employeeId);
    }

    // Obtener todos los empleados
    async getAllEmployees(): Promise<any[]> {
        const empleados = await Empleado.find();
        return empleados;
    }

    // Crear un empleado    
    async createEmployee(employeeData: any): Promise<any> {
        const empleado = new Empleado(employeeData);
        await empleado.save();
        return empleado;
    }
}
