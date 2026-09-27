import { z } from 'zod';

const employeeFields = {
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
    cargo: z.string().trim().min(1, 'El cargo es obligatorio').max(100),
    departamento: z.string().trim().min(1, 'El departamento es obligatorio').max(100),
    sueldo: z.coerce.number().positive('El sueldo debe ser un número mayor que cero'),
};

export const createEmployeeDto = z.object(employeeFields).strict();

export const updateEmployeeDto = z
    .object(employeeFields)
    .partial()
    .strict()
    .refine((employee) => Object.keys(employee).length > 0, {
        message: 'Debe enviar al menos un campo para actualizar',
    });

export const employeeParamsDto = z.object({
    id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'El id debe ser un ObjectId válido'),
}).strict();

export type CreateEmployeeDto = z.infer<typeof createEmployeeDto>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeDto>;
