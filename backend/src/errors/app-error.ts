export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly errors?: unknown,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class RequestValidationError extends AppError {
    constructor(errors: unknown) {
        super('La solicitud contiene datos inválidos', 400, errors);
        this.name = 'RequestValidationError';
    }
}
