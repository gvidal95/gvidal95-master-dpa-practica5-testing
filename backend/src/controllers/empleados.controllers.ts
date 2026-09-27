import type { Request, Response } from 'express';
import type { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto.js';
import { AppError } from '../errors/app-error.js';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository.js';
import { sendSuccess } from '../utils/api-response.js';

export class EmpleadoController {
    constructor(private readonly employeeRepository: MongoEmployeeRepository) {}

    getEmpleados = async (_req: Request, res: Response): Promise<void> => {
        const empleados = await this.employeeRepository.getAllEmployees();
        sendSuccess(res, 200, empleados, 'Empleados obtenidos correctamente');
    };

    getEmpleadosById = async (req: Request<{ id: string }, object, UpdateEmployeeDto>, res: Response): Promise<void> => {
        const empleados = await this.employeeRepository.getEmployeeById(req.params.id);
        sendSuccess(res, 200, empleados, 'Empleados obtenidos correctamente');
    };

    addEmpleado = async (req: Request<object, object, CreateEmployeeDto>, res: Response): Promise<void> => {
        const empleado = await this.employeeRepository.createEmployee(req.body);
        sendSuccess(res, 201, empleado, 'Empleado guardado');
    };

    updateEmpleado = async (req: Request<{ id: string }, object, UpdateEmployeeDto>, res: Response): Promise<void> => {
        const empleado = await this.employeeRepository.updateEmployee(req.params.id, req.body);

        if (!empleado) {
            throw new AppError('Empleado no encontrado', 404);
        }

        sendSuccess(res, 200, empleado, 'Empleado actualizado');
    };

    deleteEmpleado = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        await this.employeeRepository.deleteEmployee(req.params.id);
        sendSuccess(res, 200, null, 'Empleado eliminado');
    };
}
