import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmpty, IsDate, MinLength, IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';

@InputType()
export class CreateLocationInput {
  @Field()
  name: string;

  @Field()
  state: string;

  @Field()
  address: string;

  @IsNotEmpty()
  @Field()
  longLatPoint: string;
}
