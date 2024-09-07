import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Activite {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  activiteName: string;

  @ManyToMany(() => User, (user) => user.userActivites)
  @Field(() => [User], {nullable: true})
  activitesUsers: User[];


  @ManyToMany(() => Travel, (trvel) => trvel.travelDescription)
  @Field(() => [Travel], {nullable: true})
  activitesTravels: Travel[] 

  
}
