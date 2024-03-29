import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('users')
export class UsersController {
  constructor(private usersSerivce: UsersService) {}
}
