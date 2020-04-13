import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
