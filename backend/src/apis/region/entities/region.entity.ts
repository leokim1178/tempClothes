import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Region {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  lat: string;

  @Column()
  @Field(() => String)
  lon: string;
}
