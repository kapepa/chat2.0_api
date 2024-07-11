import { IsString } from "class-validator";
import { UserInt } from "src/user/interface/user.interface";

type LoginType = Pick<UserInt, "email" | "password">;

export class LoginAuthDto implements LoginType {
  @IsString()
  email: string;

  @IsString()
  password: string;
}