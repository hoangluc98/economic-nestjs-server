import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  getUsers(
    filterDto: GetUsersFilterDto,
    user: User,
  ): Promise<{message: string, users: User[]}> {
    return this.userRepository.getUsers(filterDto, user);
  }

  async getUserById(
    id: number
  ): Promise<{message: string, user: User}> {
    const found = await this.userRepository.getUserById(id);
    if(!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return found;
  }

  createUser(
    createUserDTO: CreateUserDto,
    file?
  ): Promise<{message: string, user: User}> {
    return this.userRepository.createUser(createUserDTO, file);
  }

  async deleteUser(
    id: number
  ): Promise<{message: string}> {
    const result = await this.userRepository.delete({ user_id: id });
    
    if(result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      message: "Delete user success"
    }
  }

  updateUser(
    id: number, 
    updateUserDto: UpdateUserDto,
    file?
  ): Promise<{message: string, user: User}> {
    return this.userRepository.updateUser(id, updateUserDto, file);
  }
}
