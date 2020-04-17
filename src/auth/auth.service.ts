import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto, typeUrl?: string): Promise<{ accessToken: string }> {
    const payload: JwtPayload = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!payload.username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (typeUrl === "signin-admin") {
      if (payload.role !== "admin") {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signUp(authRegisterDto: AuthRegisterDto) {
    return this.userRepository.createUser(authRegisterDto);
  }
}
