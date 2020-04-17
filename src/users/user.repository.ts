import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/user.create.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "src/auth/dto/auth.credentials.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UpdateUserDto } from "./dto/user.update.dto";

const selectUserQueryBuilder = [
  "user.user_id", "user.username", 
  "user.email", "user.avatar", 
  "user.phone", "user.gender", 
  "user.role"
];

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(
    filterDto: GetUsersFilterDto,
    user: User,
  ): Promise<{message: string, users: User[]}> {
    const { search } = filterDto;

    const query = this.createQueryBuilder("user");
    query.select(selectUserQueryBuilder);
    query.where("user.user_id != :user_id", { user_id: user.user_id });

    if(search) {
      query.andWhere("(user.username LIKE :search OR user.email LIKE :search)", { search: `%${search}%` });
    }

    try {
      const users = await query.getMany();
      return {
        message: "Get users success.",
        users: users
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(
    id: number
  ): Promise<{message: string, user: User}> {
    try {
      let user = await this.createQueryBuilder("user")
        .select(["user.user_id", "user.username", 
          "user.email", "user.avatar", 
          "user.phone", "user.gender", 
          "user.role"
        ])
        .where("user.user_id = :user_id", { user_id: id })
        .getOne();

      return {
        message: "Get user by id success.",
        user: user
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto, file?): Promise<{message: string, user: User}> {
    const user = new User();
    Object.assign(user, createUserDto);
    user.avatar = file ? file.filename : "default.jpg";
    user.role = user.role || "user";
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(user.password, user.salt);
    user.created_at = new Date;
    user.updated_at = new Date;

    try {
      const createdUser = await user.save();
      const resUser = new User();
      Object.assign(resUser, {
        user_id: createdUser.user_id,
        username: createdUser.username,
        email: createdUser.email,
        avatar: createdUser.avatar,
        phone: createdUser.phone,
        gender: createdUser.gender,
        role: createdUser.role,
      });
      
      let res = {
        message: "Create user success!",
        user: resUser
      }
      
      return res;
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
    updateUserDto: UpdateUserDto,
    file?
  ): Promise<{message: string, user: User}> {
    const user = new User();
    Object.assign(user, updateUserDto);
    user.avatar = file ? file.filename : "default.jpg";
    user.updated_at = new Date;
    try {
      await this.createQueryBuilder()
      .update(user)
      .where("user_id = :user_id", { user_id: id })
      .execute();

      let findUser = await this.findOne({
        select: [ "user_id", "username", 
                  "email", "avatar", 
                  "phone", "gender", 
                  "role"
        ],
        where: { user_id: id }
      });

      return {
        message: "Update user success",
        user: findUser
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
