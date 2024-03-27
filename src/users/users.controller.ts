import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRequest } from 'src/types/request';

@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUsers(@Req() req: JwtRequest) {
    console.log(req.user.userId);
  }
}
