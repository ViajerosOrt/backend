import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType()
export class UserDto extends User {
    @Field({nullable : true})
    @ApiProperty({ description: 'average total reviews' })
    totalReviews: number;
}