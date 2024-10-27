import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from '../../travel/entities/travel.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  state: string

  @Column()
  @Field()
  address: string

  @Column({name: 'long_lat_point'})
  @Field()
  longLatPoint: string

  @OneToMany(() => Travel, (travel) => travel.travelLocation)
  @Field(() => [Travel], {nullable: true})
  @JoinTable()
  locationTravels: Travel[]
}
