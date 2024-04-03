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
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtRequest } from 'src/types/request';
import { UpdateUserDto, UploadImageDto } from './dto/request';
import { UserDto } from './dto/response';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
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
    type: UserDto,
  })
  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async updateUserInfo(
    @Req() req: JwtRequest,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersSerivce.updateUserInfo(req.user.userId, data);
  }

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: JwtRequest): Promise<UserDto> {
    return this.usersSerivce.getUserById(req.user.userId);
  }

  @ApiOperation({ summary: '프로필 업로드용 PreSigned URL 받기' })
  @ApiParam({ name: 'type', description: 'image/jpeg, image/png' })
  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(
    @Req() req: JwtRequest,
    @Query('type') type: string,
  ): Promise<string> {
    return this.usersSerivce.getUploadUrl(req.user.userId, type);
  }

  @ApiOperation({ summary: '프로필 업로드 완료' })
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  @Patch('upload-complete')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async ProfileUploadComplete(
    @Req() req: JwtRequest,
    @Body() data: UploadImageDto,
  ): Promise<UserDto> {
    return this.usersSerivce.ProfileUploadComplete(req.user.userId, data);
  }
}
