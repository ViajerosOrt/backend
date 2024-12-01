import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { MinLength, IsNotEmpty, MaxLength } from 'class-validator';
import { SignupUserInput } from '../../auth/dto/signup-user.input';

@InputType()
export class UpdateUserInput extends PartialType(SignupUserInput) {
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

  @Field(() => [String], { nullable: true })
  activitiesIds: string[];
}
