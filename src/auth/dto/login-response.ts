import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";
import { AccessToken } from "./access_token";
@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: AccessToken

  @Field(() => User)
  user: User
}
