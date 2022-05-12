import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  like: number;

  @Column({ type: 'longtext' })
  @Field(() => String)
  detail: string;

  //   @ManyToOne(() => Region)
  //   @Field(() => Region)
  //   region : Region;
}
