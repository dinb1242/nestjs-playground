import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { CommonResponseDto } from '../../shared/dto/common-response.dto';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ):
    | Observable<CommonResponseDto<T>>
    | Promise<Observable<CommonResponseDto<T>>> {
    /**
     * handle 은 Observable 을 반환한다.
     *
     * 따라서 RxJS 를 활용하여 이를 정제하고 데이터를 반환할 수 있다.
     */
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => ({
        statusCode: response.statusCode,
        message: response.statusMessage ?? null,
        data: data,
      })),
    );
  }
}
