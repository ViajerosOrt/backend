import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AccessToken {
  @Field(() => Int)
  validForSeconds?: number;

  @Field()
  validUntil?: string;

  @Field({ nullable: false })
  value?: string;
}