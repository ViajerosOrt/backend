import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChecklistInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
