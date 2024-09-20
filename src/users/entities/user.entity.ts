import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Activity } from '../../activity/activity.entity';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  userName: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ type: 'date' })
  @Field()
  birth_date: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  userDescription: string

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


}
