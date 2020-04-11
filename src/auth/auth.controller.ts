import { Controller, Post, Body, ValidationPipe, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto): Promise<void> {
    return this.authService.signUp(authRegisterDto);
  }

  @Get('/current-user')
  @UseGuards(AuthGuard())
  getCurrentUser(@GetUser() user: User) {
    let {user_id, username, email, phone, gender} = user;
    const currentUser = {
      user_id: user_id,
      username: username,
      email: email,
      phone: phone,
      gender: gender
    }
    return currentUser;
  }
}
