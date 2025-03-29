import { Role } from '../enum/role.enum';

export interface CustomJwtPayload {
  sub: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
