import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from '../interface/custom-request.interface';
import { CustomJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();

    /* 스웨거 쿠키를 체크한다. (스웨거에 부착된 쿠키) */
    const referrer = request.headers.referer;
    if (!!referrer && referrer.includes('apidoc')) {
      console.log('===> 스웨거에서 호출된 요청입니다.');
      const signedCookies = request.signedCookies;
      const swaggerToken = signedCookies['access-token'] as string;

      if (swaggerToken) {
        try {
          await this.checkToken(request, swaggerToken);

          return true;
        } catch {
          throw new UnauthorizedException();
        }
      } else {
        console.log('===> 스웨거 요청에 실패하였습니다.');
        throw new UnauthorizedException();
      }
    }

    // 스웨거 제외한 요청 (앱, Postman 등 third-parties)
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.checkToken(request, token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async checkToken(request: CustomRequest, token: string) {
    try {
      const payload: CustomJwtPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );
      console.log('===> payload', payload);

      // request['user'] = payload;
      Object.assign<CustomRequest, { user: CustomJwtPayload }>(request, {
        user: payload,
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
