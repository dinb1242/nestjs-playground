import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../../shared/guard/auth.guard';
import { Response } from 'express';
import { CustomRequest } from '../../../shared/interface/custom-request.interface';
import { AuthPublic } from '../../../shared/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthPublic()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: Record<string, any>,
  ) {
    const aT = await this.authService.signIn('john', 'changeme');

    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 24 hour 7일
    res.cookie('access-token', aT['access_token'], {
      expires: expiryDate,
      httpOnly: true,
      signed: true,
    });

    return aT;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: CustomRequest) {
    return req.user;
  }
}
