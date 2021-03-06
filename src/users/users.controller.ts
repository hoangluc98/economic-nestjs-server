import { Controller, Post, UseGuards, Get, Query, ValidationPipe, Param, ParseIntPipe, UsePipes, Body, Delete, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import { CreateUserDto } from './dto/user.create.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from "@nestjs/platform-express"
import { multerOptions } from 'src/config/multer.config';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    @GetUser() user: User,
  ): Promise<{message: string, users: User[]}> {
    return this.usersService.getUsers(filterDto, user);
  }

  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{message: string, user: User}> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  @UsePipes(ValidationPipe)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?
  ): Promise<{message: string, user: User}> {
    return this.usersService.createUser(createUserDto, file);
  }

  @Delete('/:id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{message: string}> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?
  ): Promise<{message: string, user: User}> {
    return this.usersService.updateUser(id, updateUserDto, file);
  }
}
