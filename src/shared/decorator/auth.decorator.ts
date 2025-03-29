import { SetMetadata } from '@nestjs/common';

/* 공개 API 데코레이터 */
export const IS_PUBLIC_KEY = 'isPublic';
export const AuthPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
