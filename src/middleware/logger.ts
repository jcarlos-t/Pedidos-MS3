import { Request, Response, NextFunction } from 'express';

// Middleware para logging de solicitudes
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  // Log del body para requests POST/PUT (sin datos sensibles)
  if ((method === 'POST' || method === 'PUT') && req.body) {
    const bodyCopy = { ...req.body };
    // Ocultar datos sensibles si los hay
    if (bodyCopy.password) bodyCopy.password = '[HIDDEN]';
    if (bodyCopy.token) bodyCopy.token = '[HIDDEN]';
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(bodyCopy, null, 2));
  }
  
  // Log de query parameters
  if (Object.keys(req.query).length > 0) {
    console.log(`[${timestamp}] Query Params:`, JSON.stringify(req.query, null, 2));
  }
  
  // Interceptar la respuesta para loggear el status
  const originalSend = res.send;
  res.send = function(data) {
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m'; // Rojo, Amarillo, Verde
    const resetColor = '\x1b[0m';
    
    console.log(`${statusColor}[${timestamp}] Response: ${statusCode}${resetColor}`);
    
    // Log de la respuesta si es un error o si es pequeña
    if (statusCode >= 400 || (data && typeof data === 'string' && data.length < 1000)) {
      console.log(`[${timestamp}] Response Body:`, data);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Middleware para logging de errores
export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  
  console.error(`\x1b[31m[${timestamp}] ERROR in ${method} ${url}:\x1b[0m`);
  console.error(`\x1b[31m[${timestamp}] Error Message: ${error.message}\x1b[0m`);
  console.error(`\x1b[31m[${timestamp}] Error Stack: ${error.stack}\x1b[0m`);
  
  next(error);
};
