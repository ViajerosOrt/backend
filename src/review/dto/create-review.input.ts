import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  stars: string;

  @Field()
  content: string;

 
}