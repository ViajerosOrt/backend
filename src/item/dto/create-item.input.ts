import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field()
  name: string;

  @Field()
  isEndable: boolean;
}
