import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateThingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
