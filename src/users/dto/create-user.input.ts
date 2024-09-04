import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmpty, IsDate, MinLength, IsEmail,IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @MinLength(8,{
    message: "La caontrasenia tiene que tener mas de 8 caracteres"
  })
  @IsNotEmpty()
  @Field()
  password: string;


  @IsNotEmpty()
  @Field()
  birth_date: string;

  
}
