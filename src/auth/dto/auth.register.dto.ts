import { IsString, MinLength, MaxLength, Matches, IsEmail, IsIn, IsDate, IsOptional } from "class-validator";

export class AuthRegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
    { message: "Name is invalid." }  
  )
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
    { message: "Password too weak." },
  )
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^(0)[0-9]{9,10}$/,
    { message: "Phone is invalid."},
  )
  phone: string;

  @IsString()
  @IsIn(["male", "female"])
  gender: string;

  @IsString()
  @IsIn(["user", "admin"])
  role: string = "user";

  @IsOptional()
  @IsString()
  avatar: string;

  // @IsDate()
  // created_at: Date;

  // @IsDate()
  // updated_at: Date;
}
