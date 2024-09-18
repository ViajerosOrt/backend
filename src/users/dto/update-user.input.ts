import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEmpty, IsDate, MinLength, IsEmail,IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {



  @IsNotEmpty()
  @Field()
  userName: string;

  @MinLength(8,{
    message: 'The password must be more than 8 characters long'
  })
  @IsNotEmpty()
  @Field()
  password: string;


  @MaxLength(200)
  @Field({nullable: true})
  userDescription:string
}
