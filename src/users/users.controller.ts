import {
  Controller,
  UseGuards,
  Put,
  Body,
  HttpCode,
  Req,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRequest } from 'src/types/request';
import { UpdateUserInfoDto, ReturnUserInfoDto } from './users.dto';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('users')
export class UsersController {
  constructor(private usersSerivce: UsersService) {}

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({
    status: 201,
    description: '내 정보 수정 성공',
    type: ReturnUserInfoDto,
  })
  @Put('my-info')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  async updateUserInfo(
    @Req() req: JwtRequest,
    @Body() data: UpdateUserInfoDto,
  ): Promise<ReturnUserInfoDto> {
    return this.usersSerivce.updateUserInfo(req.user.userId, data);
  }

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    type: ReturnUserInfoDto,
  })
  @Get('my-info')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: JwtRequest): Promise<ReturnUserInfoDto> {
    return this.usersSerivce.getUserById(req.user.userId);
  }
}
