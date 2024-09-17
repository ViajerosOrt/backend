import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from 'src/travel/entities/travel.entity';
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
  long_lat_point: string

  @OneToMany(() => Travel, (travel) => travel.travelLocation)
  @Field(() => [Travel], {nullable: true})
  @JoinTable()
  locationTravels: Travel[]
}
