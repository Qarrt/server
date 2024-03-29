import {
  Controller,
  UseGuards,
  Put,
  Body,
  HttpCode,
  Req,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRequest } from 'src/types/request';
import {
  UpdateUserInfoDto,
  ReturnUserInfoDto,
  UploadImageDto,
} from './users.dto';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('my-info')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('my-info')
export class MyInfoController {
  constructor(private usersSerivce: UsersService) {}

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({
    status: 201,
    type: ReturnUserInfoDto,
  })
  @Put()
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
    type: ReturnUserInfoDto,
  })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Req() req: JwtRequest): Promise<ReturnUserInfoDto> {
    return this.usersSerivce.getUserById(req.user.userId);
  }

  @ApiOperation({ summary: '프로필 업로드용 PreSigned URL 받기' })
  @Get('upload-url')
  @UseGuards(AuthGuard('jwt'))
  async getUploadUrl(
    @Req() req: JwtRequest,
    @Query('type') type: string,
  ): Promise<string> {
    return this.usersSerivce.getUploadUrl(req.user.userId, type);
  }

  @ApiOperation({ summary: '프로필 업로드 완료' })
  @ApiResponse({
    status: 201,
    type: ReturnUserInfoDto,
  })
  @Patch('upload-complete')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  async ProfileUploadComplete(
    @Req() req: JwtRequest,
    @Body() data: UploadImageDto,
  ): Promise<ReturnUserInfoDto> {
    return this.usersSerivce.ProfileUploadComplete(req.user.userId, data);
  }
}
