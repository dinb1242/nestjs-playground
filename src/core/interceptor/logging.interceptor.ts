import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const now = Date.now();
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap(() => {
        const res: Response = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const delay = Date.now() - now;
        console.log(`${method} ${url} ${statusCode} ${delay}ms`);
      }),
      catchError((error: HttpException) => {
        const delay = Date.now() - now;
        const statusCode = error.getStatus ? error.getStatus() : 500;
        const errorMessage: string = error.message || 'Internal server error';
        const errorResponse: string | Response = error.getResponse()
          ? JSON.stringify(error.getResponse())
          : '';

        console.log(
          `${method} ${url} ${statusCode} ${delay}ms - Error: ${errorMessage} - Details: ${errorResponse}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
