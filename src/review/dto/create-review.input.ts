import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  stars: number;

  @Field()
  content: string;

  @Field(() => String)
  travelId: string;

  @Field(() => String)
  userReceiverId: string;

  @Field(() => String)
  userCreatorId: string;
}