import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';

@Entity()
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  state: string

  @Column()
  @Field()
  address: string

  @Column()
  @Field()
  longLatPoint: string

  @OneToMany(() => Travel, (travel) => travel.travelLocation)
  @Field(() => [Travel], {nullable: true})
  @JoinTable()
  locationTravels: Travel[]
}
