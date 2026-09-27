import type { Request, Response } from 'express';
import { jest } from '@jest/globals';
import { EmpleadoController } from './empleados.controllers.js';
import { createEmployeeDto, updateEmployeeDto } from '../dtos/employee.dto.js';
import { RequestValidationError } from '../errors/app-error.js';
import { errorHandler } from '../middlewares/error-handler.js';
import { validateRequest } from '../middlewares/validate-request.js';
import type { EmployeeRepositoryInterface } from '../repositories/employee.repository.interface.js';
// import { IEmployeeRepository } from '../repositories/employee.repository.interface';

describe('Unit Test: EmployeeController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmpleadoController;
  let mockRepository: jest.Mocked<EmployeeRepositoryInterface>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // 1. Crear un Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
    mockRepository = {
      getAllEmployees: jest.fn(),
      getEmployeeById: jest.fn(),
      createEmployee: jest.fn(),
      updateEmployee: jest.fn(),
      deleteEmployee: jest.fn(),
    };

    controller = new EmpleadoController(mockRepository);

    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
  });

  // Escenarios Positivos

  it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {

    const fakeEmployees = [
      { nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 }
    ];


    // Configurar el comportamiento esperado de la abstracción
    mockRepository.getAllEmployees.mockResolvedValue(fakeEmployees as any);
    mockRequest = {};

    await controller.getEmpleados(mockRequest as Request, mockResponse as Response);

    // Verificaciones asertivas del contrato
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: fakeEmployees,
      message: "Empleados obtenidos correctamente",
      success: true
    });
    expect(mockRepository.getAllEmployees).toHaveBeenCalledTimes(1);
  });

  it('Debería crear un empleado y retornar un estado 201', async () => {
    const employeeData = {
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4000,
    };
    const createdEmployee = { _id: '123', ...employeeData };

    mockRepository.createEmployee.mockResolvedValue(createdEmployee);
    mockRequest = { body: employeeData };

    await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

    expect(mockRepository.createEmployee).toHaveBeenCalledWith(employeeData);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      data: createdEmployee,
      message: 'Empleado guardado',
      success: true,
    });
  });

  it('Debería actualizar un empleado existente y retornar un estado 200', async () => {
    const employeeId = '507f1f77bcf86cd799439011';
    const employeeChanges = { sueldo: 4500 };
    const updatedEmployee = {
      _id: employeeId,
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4500,
    };

    mockRepository.updateEmployee.mockResolvedValue(updatedEmployee);
    mockRequest = { params: { id: employeeId }, body: employeeChanges };

    await controller.updateEmpleado(mockRequest as Request, mockResponse as Response);

    expect(mockRepository.updateEmployee).toHaveBeenCalledWith(employeeId, employeeChanges);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      data: updatedEmployee,
      message: 'Empleado actualizado',
      success: true,
    });
  });

  // Escenarios Negativos

  it('Debería retornar 404 si se intenta actualizar un empleado inexistente', async () => {
    const employeeId = '507f1f77bcf86cd799439011';
    mockRepository.updateEmployee.mockResolvedValue(null);
    mockRequest = { params: { id: employeeId }, body: { sueldo: 4500 } };

    const updateError = await controller
      .updateEmpleado(mockRequest as Request, mockResponse as Response)
      .catch((error: unknown) => error);

    expect(updateError).toMatchObject({
      statusCode: 404,
      message: 'Empleado no encontrado',
    });

    errorHandler(updateError, mockRequest as Request, mockResponse as Response, jest.fn());

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Empleado no encontrado',
      data: null,
    }));
    expect(mockRepository.updateEmployee).toHaveBeenCalledWith(employeeId, { sueldo: 4500 });
  });

  it('Debería devolver un error 400 al crear un empleado si el sueldo contiene letras', () => {
    const nextMock = jest.fn();
    const request = {
      body: {
        nombre: 'Andrés Mendoza',
        cargo: 'Arquitecto',
        departamento: 'TI',
        sueldo: 'letras',
      },
    } as Request;

    validateRequest(createEmployeeDto, 'body')(request, mockResponse as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(expect.any(RequestValidationError));
    const validationError = nextMock.mock.calls[0]?.[0] as RequestValidationError;
    expect(validationError.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['sueldo'] })]),
    );

    errorHandler(validationError, request, mockResponse as Response, jest.fn());

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'La solicitud contiene datos inválidos',
      data: null,
    }));
    expect(mockRepository.createEmployee).not.toHaveBeenCalled();
  });

  it('Debería devolver un error 400 al actualizar un empleado si el sueldo es negativo', () => {
    const nextMock = jest.fn();
    const request = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { sueldo: -100 },
    } as unknown as Request;

    validateRequest(updateEmployeeDto, 'body')(request, mockResponse as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(expect.any(RequestValidationError));
    const validationError = nextMock.mock.calls[0]?.[0] as RequestValidationError;
    expect(validationError.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['sueldo'] })]),
    );

    errorHandler(validationError, request, mockResponse as Response, jest.fn());

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'La solicitud contiene datos inválidos',
      data: null,
    }));
    expect(mockRepository.updateEmployee).not.toHaveBeenCalled();
  });
});