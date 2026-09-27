import express from 'express';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import empleadosRoutes from './routes/empleados.routes.js';


const app = express();
app.use(express.json());

//settings
app.set('puerto',process.env.PORT|| 3000);
app.set('nombreApp','Gestión de empleados');
app.use(morgan('dev'));
// app.use('/api/v1',require('./routes/empleados.routes'));
app.use('/api/v1',empleadosRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

// module.exports=app;
export default app;
