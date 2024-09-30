import { InputType, Int, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEmpty, IsDate, MinLength, IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { IsAdult } from '../../validators/is-adult.validator';

@InputType()
export class SignupUserInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @MinLength(8, {
    message: 'The password must be more than 8 characters long'
  })
  @IsNotEmpty()
  @Field()
  password: string;


  @IsNotEmpty()
  @Field()
  @Type(() => Date)
  @Validate(IsAdult)
  birthDate: Date;


  @Field({ nullable: true })
  description: string

}
