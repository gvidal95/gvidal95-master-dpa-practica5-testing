import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './config/database.js';
import app from './app.js';


 
// const app=express(); 
const port = 3000 
connectDatabase(); // Conexión a la base de datos
app.use(morgan('dev'));
 
app.use(express.json());
app.use(cors()); 

app.listen(port, ()=>{ 
    console.log('Servidor escuchando en el puerto ' + port); 
})
