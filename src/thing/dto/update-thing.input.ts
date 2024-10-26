import { CreateThingInput } from './create-thing.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateThingInput extends PartialType(CreateThingInput) {
  @Field(() => Int)
  id: number;
}
