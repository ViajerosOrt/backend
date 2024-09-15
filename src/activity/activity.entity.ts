import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Activity {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  activityName: string;

  @ManyToMany(() => User, (user) => user.userActivities)
  @Field(() => [User], { nullable: true })
  userActivities: User[];


  @ManyToMany(() => Travel, (trvel) => trvel.travelDescription)
  @Field(() => [Travel], { nullable: true })
  travelActivities: Travel[]


}
