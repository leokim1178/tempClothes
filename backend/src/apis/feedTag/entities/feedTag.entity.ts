import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Feed } from 'src/apis/feed/entities/feed.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class FeedTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  tagName: string;

  @Column({ default: 1 })
  @Field(() => Int)
  count: number;

  @ManyToMany(() => Feed, (feeds) => feeds.feedTag)
  @Field(() => [Feed])
  feed: Feed[];

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
