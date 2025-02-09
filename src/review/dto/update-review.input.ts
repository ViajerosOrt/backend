import { CreateReviewInput } from './create-review.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field()
  stars: string;

  @Field()
  content: string;
}
