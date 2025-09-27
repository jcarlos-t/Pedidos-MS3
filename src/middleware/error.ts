// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';

class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de manejo de errores
const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Algo salió mal, por favor intente de nuevo';

  // Log del error
  console.error(`Error: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { ErrorHandler, errorMiddleware };

