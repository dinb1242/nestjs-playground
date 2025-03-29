import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException, TypeError)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | TypeError, host: ArgumentsHost): any {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      response.status(status).json({
        statusCode: status,
        message: exception.message,
        data: null,
      });
    } else if (exception instanceof TypeError) {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        message: exception.message,
        data: null,
      });
    }
  }
}
