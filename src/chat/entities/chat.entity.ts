import { Field } from '@nestjs/graphql';
import { Message } from '../../message/entities/message.entity';
import { Travel } from '../../travel/entities/travel.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';


@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @OneToOne(() => Travel, (travel) => travel.chat, { cascade: true })
  @JoinColumn()
  @Field(() => Travel)
  travel: Travel;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  @Field(() => [User], {nullable: true})
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  @Field(() => [Message], {nullable: true})
  messages: Message[];
}