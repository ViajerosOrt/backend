import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  stars: string;

  @Column()
  @Field()
  content: string;

  @Field(() => Int)
  travelId: number;

  @Field(() => Int)
  userReceiverId: number;

  @Field(() => Int)
  userCreatorId: number

  @ManyToOne(() => User, (user) => user.reviewsCreated)
  @Field(() => User)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  @Field(() => User)
  receivedBy: User;
  
  @ManyToOne(() => Travel, (travel) => travel.reviews)
  @Field(() => Travel)
  travel: Travel;


}