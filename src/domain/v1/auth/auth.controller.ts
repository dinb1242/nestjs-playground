import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CustomRequest } from '../../../shared/interface/custom-request.interface';
import {
  AuthPublic,
  AuthRoles,
} from '../../../shared/decorator/auth.decorator';
import { Role } from '../../../shared/enum/role.enum';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth - 인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '[ALL] 일반 회원가입',
    description: '일반 회원가입을 수행한다.',
  })
  @AuthPublic()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up/common')
  async signUp() {
    return this.authService.signUp();
  }

  @AuthPublic()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInAuthDto,
  ) {
    const aT = await this.authService.signIn(body);

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일
    res.cookie('access-token', aT['access_token'], {
      expires: expiryDate,
      httpOnly: true,
      signed: true,
    });

    return aT;
  }

  @AuthRoles(Role.ADMIN)
  @Get('profile')
  getProfile(@Req() req: CustomRequest) {
    return req.user;
  }
}
