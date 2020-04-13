import { IsString, MinLength, MaxLength, Matches, IsEmail, IsIn, IsDate, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
    { message: "Name is invalid." }  
  )
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
    { message: "Password too weak." },
  )
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^(0)[0-9]{9,10}$/,
    { message: "Phone is invalid."},
  )
  phone: string;

  @IsOptional()
  @IsString()
  @IsIn(["male", "female"])
  gender: string;

  @IsOptional()
  @IsString()
  @IsIn(["user", "admin"])
  role: string = "user";
}
