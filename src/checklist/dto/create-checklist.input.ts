import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChecklistInput {
  @Field()
  name: string;
}
