import { CreateTravelInput } from './create-travel.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTravelInput extends PartialType(CreateTravelInput) {
  @Field()
  id: string;

  @Field()
  travelTitle: string;

  @Field({ nullable: true })
  travelDescription: string;

  @Field()
  startDate: Date;

  @Field()
  finishDate: Date;

  @Field(() => Int, { nullable: true })
  maxCap: number;

  @Field()
  isEndable: boolean;

  @Field()
  country: string;
}
