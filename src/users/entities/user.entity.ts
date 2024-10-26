import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Review } from '../../review/entities/review.entity';
import { Activity } from '../../activity/activity.entity';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ type: 'date' })
  @Field()
  birthDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string

  @ManyToMany(() => Activity, (activity) => activity.userActivities)
  @Field(() => [Activity], { nullable: true })
  @JoinTable()
  userActivities: Activity[];

  @OneToMany(() => Travel, (travel) => travel.creatorUser)
  @Field(() => Travel, { nullable: true })
  travelsCreated: Travel[];

  @ManyToMany(() => Travel, (travel) => travel.usersTravelers)
  @Field(() => [Travel], { nullable: true })
  @JoinTable()
  joinsTravels: Travel[];

  @OneToMany(() => Review, (review) => review.createdBy)
  @Field(() => [Review], { nullable: true })
  reviewsCreated: Review[];

  @OneToMany(() => Review, (review) => review.receivedBy)
  @Field(() => [Review], { nullable: true })
  reviewsReceived: Review[];

}
