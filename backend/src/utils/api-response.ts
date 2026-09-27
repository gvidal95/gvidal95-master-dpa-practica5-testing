import type { Response } from 'express';

export const sendSuccess = <T>(
    res: Response,
    statusCode: number,
    data: T,
    message = 'Operación realizada correctamente',
): Response => res.status(statusCode).json({ success: true, message, data });
