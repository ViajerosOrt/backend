import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Activite } from 'src/activites/activites.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  userName: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ type: 'date' })
  @Field()
  birth_date: Date;

  @Column({nullable: true})
  @Field({nullable: true})
  userDescription:string

  @ManyToMany(() => Activite, (activite) => activite.activitesUsers)
  @Field(() => [Activite], { nullable: true })
  @JoinTable()
  userActivites: Activite[];

  @OneToMany(() => Travel, (travel) => travel.creatorUser)
  @Field(() => Travel, {nullable: true} )
  travelsCreated: Travel[];

  @ManyToMany(() => Travel, (travel) => travel.usersTravelers)
  @Field(() => [Travel], {nullable: true})
  @JoinTable()
  joinsTravels: Travel[];


  
}
