import { InputType, Int, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class CreateTravelInput {
  @Field()
  travelTitle: string;

  @Field()
  travelDescription: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  country: string;

  @Field()
  maxCap: number;

  @Type(() => Date)
  @Field()
  startDate: Date;

  @Type(() => Date)
  @Field()
  finishDate: Date;

  @Field()
  isEndable: boolean;

  @Field({ nullable: true })
  countryOfOrigin?: string;
}
