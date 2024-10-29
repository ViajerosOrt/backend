import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Item } from '../../item/entities/item.entity';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Checklist {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
  
  @Column()
  @Field()
  name: string;

  @OneToMany(() => Item, (item) => item.checklist)
  @Field(() => [Item], { nullable: true })
  items: Item[];

  @OneToOne(() => Travel, (travel) => travel.checklist)
  @Field(() => Travel)
  @JoinColumn({name: 'travel_id'}) 
  travel: Travel;
}
