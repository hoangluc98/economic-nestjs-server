import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}

  @Post('/signup')
  singUp(@Body(ValidationPipe) authRegisterDto: AuthRegisterDto): Promise<void> {
    return this.authService.singUp(authRegisterDto);
  }
}
