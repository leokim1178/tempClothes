import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType() // DB에 지역 값 미리 저장하기
export class Region {
  @PrimaryColumn()
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  location_name: string;
}
