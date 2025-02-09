import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteUserResponse {
  @Field()
  successMessage: string;
}