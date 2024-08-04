import { UserInt } from "../interface/user.interface";

type GetProps = Pick<UserInt, "firstName" | "lastName" > & { stack: string }

export class FindUsersDto implements GetProps{
  firstName: string;
  lastName: string;
  stack: string;
}