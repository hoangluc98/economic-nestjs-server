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
  ): Promise<User[]> {
    return this.userRepository.getUsers(filterDto, user);
  }

  async getUserById(
    id: number,
    user: User,
  ): Promise<User> {
    // const found = await this.userRepository.findOne({ where: { user_id: id } });
    const found = await this.userRepository.createQueryBuilder("user")
      .select(["user.user_id", "user.username", 
        "user.email", "user.avatar", 
        "user.phone", "user.gender", 
        "user.role"
      ])
      .where("user.user_id = :user_id", { user_id: id })
      .getOne();
    if(!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return found;
  }

  async createUser(
    createUserDTO: CreateUserDto
  ): Promise<void>  {
    return this.userRepository.createUser(createUserDTO);
  }

  async deleteUser(
    id: number
  ): Promise<void> {
    const result = await this.userRepository.delete({ user_id: id });
    
    if(result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async updateUser(
    id: number, 
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userRepository.updateUser(id, updateUserDto);
  }
}
