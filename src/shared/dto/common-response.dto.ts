export interface CommonResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;
}
