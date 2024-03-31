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
import {
  KakaoAuthGuard,
  NaverAuthGuard,
  GoogleAuthGuard,
  JwtAuthGuard,
} from './guards';
import { Response } from 'express';
import {
  KakaoRequest,
  JwtRequest,
  NaverRequest,
  GoogleRequest,
} from 'src/types/request';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
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

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 301,
    description: '카카오 로그인 성공 / 홈으로 리다이렉트',
    headers: {
      'Set-Cookie': {
        description:
          'accessToken, refreshToken, isLoggedIn - isLoggedIn만 httpOnly: false',
      },
    },
  })
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(301)
  async googleLogin(@Req() req: GoogleRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login({
      provider: 'google',
      providerId: req.user.googleId,
    });
    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('isLoggedIn', true, { ...this.cookieOptions, httpOnly: false });
    return res.redirect(this.configService.get('CLIENT_URL')!);
  }

  @ApiOperation({ summary: 'accessToken 재발급' })
  @ApiResponse({
    status: 200,
    description: 'accessToken 재발급 성공',
    headers: {
      'Set-Cookie': {
        description: 'accessToken',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
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

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 204,
    description: '로그아웃 성공, 쿠키 삭제',
  })
  @ApiUnauthorizedResponse({ description: 'unauthorized - jwt 토큰 인증 실패' })
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
