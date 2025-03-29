import { Request } from 'express';
import { CustomJwtPayload } from './jwt-payload.interface';

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
}
