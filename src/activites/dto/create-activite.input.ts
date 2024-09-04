import { Field, InputType } from "@nestjs/graphql";
import {IsNotEmpty, MaxLength, MinLength} from 'class-validator'

@InputType()
export class CreateActiviteInput{

    @MinLength(5)
    @MaxLength(20)
    @IsNotEmpty({
        message: "Este campo no puede estar vacio"
    })
    @Field()
    activiteName: string;

}