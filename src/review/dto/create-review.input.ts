import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  stars: number;

  @Field()
  content: string;

  @Field(() => Int)
  travelId: number;

  @Field(() => Int)
  userReceiverId: number;

  @Field(() => Int)
  userCreatorId: number;
}