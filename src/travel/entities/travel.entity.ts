import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Review } from '../../review/entities/review.entity';
import { Location } from '../../location/entities/location.entity';
import { Activity } from '../../activity/activity.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Checklist } from '../../checklist/entities/checklist.entity';

@Entity()
@ObjectType()
export class Travel {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ name: 'title' })
  @Field()
  travelTitle: string;

  @Column({ nullable: true, name: 'travel_description' })
  @Field({ nullable: true })
  travelDescription: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  @Field()
  startDate: Date;

  @Column({ type: 'timestamp', name: 'finish_date' })
  @Field()
  finishDate: Date;

  @Column({ nullable: true, name: 'max_cap' })
  @Field(() => Int, { nullable: true })
  maxCap: number;

  @Column({ type: 'boolean', default: true, name: 'is_endable' })
  @Field()
  isEndable: boolean;

  //********************************** */

  @ManyToOne(() => User, (user) => user.travelsCreated)
  @Field(() => User)
  @JoinColumn({ name: 'creator_user_id' })
  creatorUser: User;

  //******************************************** */

  @ManyToMany(() => User, (user) => user.joinsTravels)
  @Field(() => [User], { nullable: true })
  usersTravelers: User[];

  //********************************************* */

  @ManyToMany(() => Activity, (activity) => activity.travelActivities)
  @Field(() => [Activity], { nullable: true })
  @JoinTable()
  travelActivities: Activity[];

  /******************************** */
  @OneToMany(() => Review, (review) => review.travel)
  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  /******************************** */

  @ManyToOne(() => Location, (location) => location.locationTravels)
  @Field(() => Location)
  @JoinColumn({ name: 'location_id' })
  travelLocation: Location;


  /*************************** */
  @OneToOne(() => Checklist, (checklist) => checklist.travel)
  @Field(() => Checklist, { nullable: true })
  checklist: Checklist;

  /**************gets******************* */
 
  @Field( { nullable: true })
  usersCount: number;

  @Field( { nullable: true })
  isJoined: boolean;
}
