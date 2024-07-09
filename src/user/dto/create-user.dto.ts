import { ArrayMinSize, IsEmail, IsOptional, IsString } from "class-validator";
import { UserInt } from "../interface/user.interface";

type CreateExtract = Pick<Exclude<UserInt, "avatarUrl">, "username" | "email" | "description" | "avatarUrl" | "firstName" | "lastName" | "stack" | "city"> & { avatarUrl: UserInt["avatarUrl"] | File };

export class CreateUserDto implements CreateExtract {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  description: string;

  @IsOptional()
  avatarUrl: string & File;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  stack: string[];

  @IsString()
  city: string;
}
