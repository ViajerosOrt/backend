import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Travel } from '../entities/travel.entity';

@ObjectType()
export class TravelDto extends Travel {
  @Field({ nullable: true })
  @ApiProperty({ description: 'Indicates whether the user has joined the trip', default: false })
  isJoined?: boolean;

  @Field(() => Int, { nullable: true })
  @ApiProperty({ description: 'Number of users who have joined the trip' })
  usersCount?: number;
}