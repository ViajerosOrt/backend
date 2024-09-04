import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Activite } from 'src/activites/activites.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  birth_date: string;

  @ManyToMany(() => Activite, (activite) => activite.activitesUsers)
  @Field(() => [Activite], { nullable: true })
  @JoinTable()
  userActivites: Activite[];
}
