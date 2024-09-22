import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { MinLength, IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsNotEmpty()
  @Field()
  name: string;

  @MinLength(8, {
    message: 'The password must be more than 8 characters long'
  })
  @IsNotEmpty()
  @Field()
  password: string;


  @MaxLength(200)
  @Field({ nullable: true })
  description: string
}
