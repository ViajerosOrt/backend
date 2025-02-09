import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Review } from '../../review/entities/review.entity';
import { Activity } from '../../activity/activity.entity';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '../../item/entities/item.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Message } from '../../message/entities/message.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ name: 'birth_date', type: 'timestamp' })
  @Field()
  birthDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  instagram: string

  @Column({type: 'varchar', nullable: true })
  @Field({ nullable: true })
  whatsapp: string

  @Column({ nullable: true, name: 'country' })
  @Field({ nullable: true })
  country: string;

  @Column({type: 'varchar', nullable: true })
  @Field({ nullable: true })
  userImage: string

  @ManyToMany(() => Activity, (activity) => activity.userActivities)
  @Field(() => [Activity], { nullable: true })
  @JoinTable()
  userActivities: Activity[];

  @OneToMany(() => Travel, (travel) => travel.creatorUser)
  @Field(() => [Travel], { nullable: true })
  travelsCreated?: Travel[];

  @ManyToMany(() => Travel, (travel) => travel.usersTravelers)
  @Field(() => [Travel], { nullable: true })
  @JoinTable()
  joinsTravels?: Travel[];

  @OneToMany(() => Review, (review) => review.createdUserBy)
  @Field(() => [Review], { nullable: true })
  reviewsCreated?: Review[];

  @OneToMany(() => Review, (review) => review.receivedUserBy)
  @Field(() => [Review], { nullable: true })
  reviewsReceived?: Review[];

  @OneToMany(() => Item, (item) => item.user)
  @Field(() => [Item], { nullable: true })
  items?: Item[];


  @ManyToMany(() => Chat, (chat) => chat.users)
  @Field(() => [Chat], {nullable: true})
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  @Field(() => [Message], {nullable: true})
  messages: Message[];


}
