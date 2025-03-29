import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CustomJwtPayload } from '../../../shared/interface/jwt-payload.interface';
import { Role } from '../../../shared/enum/role.enum';
import { SignInAuthDto } from './dto/sign-in-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInAuthDto): Promise<any> {
    const user = await this.userService.findOne(body.username);
    if (user?.password !== body.password) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload: CustomJwtPayload = {
      sub: user.userId,
      username: user.username,
      role: Role.USER,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
