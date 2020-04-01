import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { user } from "./user.entity";

@Injectable()
export class AuthService {
    signIn(authCredentialsDto: AuthCredentialsDto): string {
        if( authCredentialsDto.username === user.username &&
            authCredentialsDto.password === user.password
            ) {
            return `Hi, ${authCredentialsDto.username}`;
        }
        return "Login failed"
    }
}
