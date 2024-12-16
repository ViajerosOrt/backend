import { InputType, Int, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  content: string;

  @Type(() => Date)
  @Field()
  createdAt: Date;
}
