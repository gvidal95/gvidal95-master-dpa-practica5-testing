import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { RequestValidationError } from '../errors/app-error.js';

type RequestPart = 'body' | 'params';

export const validateRequest = (schema: ZodType, part: RequestPart) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req[part]);

        if (!result.success) {
            next(new RequestValidationError(result.error.issues));
            return;
        }

        if (part === 'body') {
            req.body = result.data;
        } else {
            req.params = result.data as Record<string, string>;
        }

        next();
    };
