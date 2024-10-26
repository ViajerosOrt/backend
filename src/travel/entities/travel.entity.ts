import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Review } from '../../review/entities/review.entity';
import { Location } from '../../location/entities/location.entity';
import { Activity } from '../../activity/activity.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class Travel {

  @PrimaryGeneratedColumn('uuid')
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
  maxCap: number

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
  @OneToMany(() => Review, (review) => review.travel)
  @Field(() => [Review], { nullable: true })
  reviews: Review[];

/******************************** */

@ManyToOne(() => Location, (location) => location.locationTravels)
@Field(() => Location)
@JoinColumn({ name: "locationId" }) 
travelLocation: Location


}
