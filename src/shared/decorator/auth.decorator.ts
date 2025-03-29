import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

/* 공개 API 데코레이터 */
export const IS_PUBLIC_KEY = 'isPublic';
export const AuthPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

/* 권한 API 데코레이터 */
export const ROLES_KEY = 'roles';
export const AuthRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
