export class AppError extends Error {
    constructor(mensaje, statusCode) {
        super(mensaje);
        this.statusCode = statusCode;
    }
}
