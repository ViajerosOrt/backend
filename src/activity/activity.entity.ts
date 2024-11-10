import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../travel/entities/travel.entity';
import { User } from '../users/entities/user.entity';
import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({name: 'activity_name'})
  @Field()
  activityName: string;

  @ManyToMany(() => User, (user) => user.userActivities)
  @Field(() => [User], { nullable: true })
  userActivities: User[];


  @ManyToMany(() => Travel, (trvel) => trvel.travelDescription)
  @Field(() => [Travel], { nullable: true })
  travelActivities: Travel[]


}
