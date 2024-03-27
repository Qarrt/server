import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guards/kakao.guard';
import { Response } from 'express';
import { KakaoRequest, JwtRequest } from '../types/request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(301)
  async kakaoLogin(@Req() req: KakaoRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'kakao',
      providerId: req.user.kakaoId,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }

  @Get('refresh')
  @HttpCode(200)
  async refresh(@Req() req: JwtRequest, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
      });
      return res.send();
    } catch (err) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException();
    }
  }
}
