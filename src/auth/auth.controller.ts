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
import { NaverAuthGuard } from './guards/naver.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Response } from 'express';
import { KakaoRequest, JwtRequest, NaverRequest } from '../types/request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  cookieOptions = {
    httpOnly: true,
    secure: true,
    domain: this.configService.get('COOKIE_DOMAIN'),
  };

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @HttpCode(301)
  async kakaoLogin(@Req() req: KakaoRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'kakao',
      providerId: req.user.kakaoId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }

  @Get('naver')
  @UseGuards(NaverAuthGuard)
  @HttpCode(301)
  async naverLogin(@Req() req: NaverRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'naver',
      providerId: req.user.naverId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
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
      res.clearCookie('accessToken', this.cookieOptions);
      res.clearCookie('refreshToken', this.cookieOptions);
      res.clearCookie('isLoggedIn', { ...this.cookieOptions, httpOnly: false });
      throw new UnauthorizedException();
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Req() req: JwtRequest, @Res() res: Response) {
    this.authService.logout(req.user.userId);
    res.clearCookie('accessToken', this.cookieOptions);
    res.clearCookie('refreshToken', this.cookieOptions);
    res.clearCookie('isLoggedIn', { ...this.cookieOptions, httpOnly: false });
    return res.send();
  }
}
