import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto, EmailDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IRequest } from '../../auth/auth.types';
import { FailedResponseDto } from '../../../shared/dtos/failed-response.dto';
import { SuccessUserResponseDto } from '../dto/user-response.dto';
import { SUCCESS } from '../../../shared/constants/message.constants';
import { User } from '../entities/user.entity';
import { SuccessResponseDto } from '../../../shared/dtos/success-response.dto';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    description: 'The route used by user to get detail of current user',
  })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 400, type: FailedResponseDto })
  findMe(@Req() req: IRequest) {
    const { id } = req.user;
    return this.usersService.findOneById(+id);
  }

  @Post('request-change-password')
  @ApiOperation({
    description: 'The route used to send request to change password',
  })
  @ApiResponse({ status: 200, type: SuccessResponseDto })
  @ApiResponse({ status: 400, type: FailedResponseDto })
  async requestChangePassword(
    @Body() { email }: EmailDto,
    @Req() req: IRequest,
  ) {
    const user = req.user;
    await this.usersService.requestChangePassword(email);

    return {
      message: SUCCESS,
    };
  }

  @Post()
  @ApiOperation({
    description: 'The route used to create new user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: SuccessUserResponseDto })
  @ApiResponse({ status: 400, type: FailedResponseDto })
  async create(@Body() createUser: CreateUserDto, @Req() req: IRequest) {
    return this.usersService
      .create(createUser)
      .then((res) => ({
        message: SUCCESS,
        data: res,
      }))
      .catch((err) => {
        throw new BadRequestException(err.sqlMessage);
      });
  }

  @Put(':id')
  @ApiOperation({
    description: 'The route used to update user',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: SuccessUserResponseDto })
  @ApiResponse({ status: 400, type: FailedResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
    @Req() req: IRequest,
  ) {
    const user = req.user;
    return this.usersService
      .update(+id, updateUser, user)
      .then((res) => ({
        message: SUCCESS,
        data: res,
      }))
      .catch((err) => {
        throw new BadRequestException(err.sqlMessage);
      });
  }
}
