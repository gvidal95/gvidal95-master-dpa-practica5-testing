import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors/app-error.js';

const sendError = (
    res: Response,
    statusCode: number,
    message: string,
    errors?: unknown,
) => res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(errors === undefined ? {} : { errors }),
});

export const notFoundHandler: RequestHandler = (req, _res, next) => {
    next(new AppError(`No se encontró la ruta ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        sendError(res, error.statusCode, error.message, error.errors);
        return;
    }

    if (error instanceof mongoose.Error.CastError) {
        sendError(res, 400, 'El identificador enviado no es válido');
        return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
        sendError(res, 422, 'Los datos no cumplen las reglas de persistencia');
        return;
    }

    console.error('Error no controlado:', error);
    sendError(res, 500, 'Error interno del servidor');
};
