import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Transport {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ name: 'name' })
  @Field()
  name: string;

  
  @OneToMany(() =>  Travel, (travel) => travel.transport)
  @Field(() => [Travel], {nullable: true})
  travels: Travel[];
}
