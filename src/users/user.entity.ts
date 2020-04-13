import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({
    type: "nvarchar",
    length: 30
  })
  username: string;

  @Column({
    type: "varchar",
    length: 30,
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string = "default.jpg";

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  role: string;

  @Column()
  salt: string;

  @Column()
  created_at: Date = new Date;

  @Column()
  updated_at: Date = new Date;

  async validateUserPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
