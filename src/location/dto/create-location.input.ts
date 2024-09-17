import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmpty, IsDate, MinLength, IsEmail,IsNotEmpty, MaxLength, Validate } from 'class-validator';

@InputType()
export class CreateLocationInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  state:string;

  @IsNotEmpty()
  @Field()
  address: string;

  @IsNotEmpty()
  @Field()
  long_lat_point: string;
}
