import { CreateTransportInput } from './create-transport.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransportInput extends PartialType(CreateTransportInput) {
  @Field(() => Int)
  id: number;
}
