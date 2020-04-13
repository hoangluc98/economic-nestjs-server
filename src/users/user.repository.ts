import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/user.create.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "src/auth/dto/auth.credentials.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UpdateUserDto } from "./dto/user.update.dto";

let saltRounds = 7;
let salt = bcrypt.genSaltSync(saltRounds);
const selectUserQueryBuilder = ["user.user_id", "user.username", 
                                "user.email", "user.avatar", 
                                "user.phone", "user.gender", 
                                "user.role"
                              ];

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(
    filterDto: GetUsersFilterDto,
    user: User,
  ): Promise<User[]> {
    const { search } = filterDto;

    const query = this.createQueryBuilder("user");
    query.select(selectUserQueryBuilder);
    query.where("user.user_id != :user_id", { user_id: user.user_id });

    if(search) {
      query.andWhere("(user.username LIKE :search OR user.email LIKE :search)", { search: `%${search}%` });
    }

    try {
      const users = await query.getMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const user = new User();
    Object.assign(user, createUserDto);
    user.role = user.role || "user";
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(user.password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if(error.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Username already exists.");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    await this.createQueryBuilder()
      .update(updateUserDto)
      .where("user_id = :user_id", { user_id: id })
      .execute();
    const user = await this.findOne({
      select: [ "user_id", "username", 
                "email", "avatar", 
                "phone", "gender", 
                "role"
      ],
      where: { user_id: id }
    });
    return user;
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });
    if(user && await user.validateUserPassword(password)) {
      let payload = {
        username: user.username,
        email: user.email,
        role: user.role
      }
      
      return payload;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
