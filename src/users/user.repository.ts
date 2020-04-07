import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { UserCreateDto } from "./dto/user.create.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "src/auth/dto/auth.credentials.dto";

let saltRounds = 7;
let salt = bcrypt.genSaltSync(saltRounds);

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userCreateDto: UserCreateDto): Promise<void> {
    const { username, email, password, phone, gender, role, } = userCreateDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.gender = gender;
    user.role = role || "user";
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if(error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });

    if(user && await user.validateUserPassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
