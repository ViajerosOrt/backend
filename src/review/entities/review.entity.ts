import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @Column()
  @Field()
  stars: string;

  @Column()
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.reviewsCreated)
  @Field(() => User)
  createdUserBy: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  @Field(() => User)
  receivedUserBy: User;
  
  @ManyToOne(() => Travel, (travel) => travel.reviews)
  @Field(() => Travel)
  travel: Travel;


}