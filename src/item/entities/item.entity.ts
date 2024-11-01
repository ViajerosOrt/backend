import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Checklist } from '../../checklist/entities/checklist.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ type: 'boolean', default: false, name: 'is_endable'})

  @Field()
  state: boolean;

  @ManyToOne(() => Checklist, (checklist) => checklist.items)
  @Field(() => Checklist)
  @JoinColumn({ name: "checklist_id" }) 
  checklist: Checklist;

  @ManyToOne(() => User, (user) => user.items, { nullable: true })
  @Field(() => User, {nullable: true})
  @JoinColumn({ name: "user_id" }) 
  user?: User;

}
