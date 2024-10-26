import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Checklist {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
}
