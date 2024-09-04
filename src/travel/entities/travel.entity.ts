import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Travel {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
