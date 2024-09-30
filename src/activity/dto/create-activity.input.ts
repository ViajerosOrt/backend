import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateActivityInput {

    @MinLength(5)
    @MaxLength(20)
    @IsNotEmpty({
        message: 'This field is required'
    })
    @Field()
    activityName: string;

}