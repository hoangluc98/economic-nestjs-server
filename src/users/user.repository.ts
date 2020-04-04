import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { UserCreateDto } from "./dto/user.create.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

let saltRounds = 7;

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

    let salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(password, salt);

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
}
