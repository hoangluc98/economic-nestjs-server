import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(['user_id', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  role: string = "user";

  @Column()
  created_at: Date = new Date;

  @Column()
  updated_at: Date = new Date;

  async validateUserPassword(password: string, salt: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt);
    return hash === this.password;
  }
}
