import { InputType, Int, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class CreateTravelInput {
  @Field()
  travelTitle: string;

  @Field()
  travelDescription: string;

  @Type(() => Date)
  @Field()
  startDate: Date;

  @Type(() => Date)
  @Field()
  finishDate: Date;

  @Field()
  max_cap: number;

  @Field()
  isEndable: boolean;

  @Field(() => Int)
  creatorUserId: number;
}
