import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { ZodSerializationException } from 'nestjs-zod';

interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
  received?: unknown;
  expected?: unknown;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: ValidationErrorDetail[];
  validationType: 'request' | 'response';
}

@Catch(ZodError, ZodSerializationException)
export class ZodValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodValidationFilter.name);

  catch(exception: ZodError | ZodSerializationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let zodError: ZodError;
    let validationType: 'request' | 'response';
    let statusCode: number;

    // Handle ZodSerializationException (response validation)
    if (exception instanceof ZodSerializationException) {
      const potentialZodError = exception.getZodError();
      
      // Type guard to ensure it's a ZodError
      if (potentialZodError instanceof ZodError) {
        zodError = potentialZodError;
      } else {
        // Fallback for unknown error type
        this.handleUnknownZodError(exception, response, request);
        return;
      }
      
      validationType = 'response';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    } 
    // Handle ZodError (request validation)
    else {
      zodError = exception;
      validationType = 'request';
      statusCode = HttpStatus.BAD_REQUEST;
    }

    // Format error details
    const errorDetails = this.formatErrorDetails(zodError);

    // Log appropriately
    this.logValidationError(zodError, validationType, request);

    // Prepare error response
    const errorResponse: ErrorResponse = {
      statusCode,
      message: validationType === 'request' 
        ? 'Validation failed' 
        : 'Response validation failed',
      error: HttpStatus[statusCode],
      timestamp: new Date().toISOString(),
      path: request.url,
      validationType,
    };

    // Only include details in development or for request validation errors
    if (process.env.NODE_ENV !== 'production' || validationType === 'request') {
      errorResponse.details = errorDetails;
    }

    response.status(statusCode).json(errorResponse);
  }

  private handleUnknownZodError(
    exception: ZodSerializationException,
    response: Response,
    request: Request
  ): void {
    const potentialZodError = exception.getZodError();
    
    this.logger.error(
      `Unknown Zod error type: ${typeof potentialZodError}`,
      potentialZodError instanceof Error ? potentialZodError.stack : undefined,
      'ZodValidationFilter'
    );

    const errorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Response validation failed',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      validationType: 'response',
    };

    // Include basic error info in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.details = [{
        field: 'unknown',
        message: 'An unknown validation error occurred',
        code: 'UNKNOWN_ERROR',
        received: potentialZodError,
      }];
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  private formatErrorDetails(zodError: ZodError): ValidationErrorDetail[] {
    return zodError.issues.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      code: error.code,
    //   received: error.received,
      expected: 'expected' in error ? (error as any).expected : undefined,
    }));
  }

  private logValidationError(
    zodError: ZodError, 
    validationType: 'request' | 'response', 
    request: Request
  ): void {
    const errorContext = {
      validationType,
      path: request.url,
      method: request.method,
      errorCount: zodError.issues.length,
      errors: zodError.issues.map(e => ({
        field: e.path.join('.'),
        code: e.code,
        message: e.message,
      })),
    };

    if (validationType === 'response') {
      // Response validation errors are more serious - log as error
      this.logger.error(
        `Response validation failed: ${zodError.message}`,
        JSON.stringify(errorContext, null, 2),
        'ZodValidationFilter'
      );
    } else {
      // Request validation errors are client issues - log as warning
      this.logger.warn(
        `Request validation failed: ${zodError.message}`,
        JSON.stringify(errorContext, null, 2),
        'ZodValidationFilter'
      );
    }
  }
}