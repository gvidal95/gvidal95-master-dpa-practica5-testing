// const express= require('express'); 
// const router=express.Router(); 
// const empleado=require('../controllers/empleados.controllers'); 

import express from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { createEmployeeDto, employeeParamsDto, updateEmployeeDto } from '../dtos/employee.dto.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository.js';

const router = express.Router();
const empleadoController = new EmpleadoController(new MongoEmployeeRepository());

router.get('/empleados/:id', empleadoController.getEmpleadosById);
router.get('/empleados', empleadoController.getEmpleados);
router.post('/empleados', validateRequest(createEmployeeDto, 'body'), empleadoController.addEmpleado);
router.put('/empleados/:id',
    validateRequest(employeeParamsDto, 'params'),
    validateRequest(updateEmployeeDto, 'body'),
    empleadoController.updateEmpleado);
router.delete('/empleados/:id', validateRequest(employeeParamsDto, 'params'), empleadoController.deleteEmpleado);

export default router;
