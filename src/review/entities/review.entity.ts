import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true, name: 'type' })
  @Field({ nullable: true })
  type: string;

  @ManyToOne(() => User, (user) => user.reviewsCreated)
  @Field(() => User)
  @JoinColumn({ name: 'create_user_id' })
  createdUserBy: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'received_user_id' })
  receivedUserBy: User;

  @ManyToOne(() => Travel, (travel) => travel.reviews)
  @Field(() => Travel, { nullable: true })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;


}