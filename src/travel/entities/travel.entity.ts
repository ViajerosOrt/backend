import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Location } from 'src/location/entities/location.entity';

import { Activity } from 'src/activity/activity.entity';

import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Travel {

  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  travelTitle: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  travelDescription: string

  @Column({ type: 'date' })
  @Field()
  startDate: Date;

  @Column({ type: 'date' })
  @Field()
  finishDate: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  max_cap: number

  @Column({ type: 'boolean', default: true })
  @Field()
  isEndable: boolean


  //********************************** */
  @Column()
  @Field(() => Int)
  creatorUserId: number;

  @ManyToOne(() => User, (user) => user.travelsCreated)
  @Field(() => User)
  creatorUser: User

  //******************************************** */

  @ManyToMany(() => User, (user) => user.joinsTravels)
  @Field(() => [User], { nullable: true })
  usersTravelers: User[]

  //********************************************* */

@ManyToMany(() => Activity, (activity) => activity.travelActivities)
@Field(() => [Activity], { nullable: true })
@JoinTable()
travelActivities: Activity[]

/******************************** */
@Column()
@Field( (type)=> Int)
locationId: number;

@ManyToOne(() => Location, (location) => location.locationTravels)
@Field(() => Location)
travelLocation: Location


}
