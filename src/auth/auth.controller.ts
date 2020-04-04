import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';

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
}
