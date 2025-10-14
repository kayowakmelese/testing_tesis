import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let message: string;
    let statusCode: HttpStatus;

    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        const fields = exception.meta?.target as string[];
        message = `A record with this ${fields.join(', ')} already exists`;
        statusCode = HttpStatus.CONFLICT;
        break;
      case 'P2025':
        // Record not found
        message = 'The requested record was not found';
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 'P2003':
        // Foreign key constraint violation
        message = 'Invalid reference to related record';
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      default:
        // Log unexpected errors but don't expose details to client
        console.error('Prisma error:', exception);
        message = 'An unexpected database error occurred';
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: HttpStatus[statusCode],
    });
  }
}