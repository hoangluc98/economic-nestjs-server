import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { UserCreateDto } from './../users/dto/user.create.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async singUp(authRegisterDto: AuthRegisterDto): Promise<void> {
    return this.userRepository.createUser(authRegisterDto);
  }
}
