import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Feed } from 'src/apis/feed/entities/feed.entity';
import { FeedTagCategory } from 'src/apis/feedTagCategory/entities/feedTagCategory.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => FeedTagCategory, { onDelete: 'CASCADE', nullable: true })
  @Field(() => FeedTagCategory, { nullable: true })
  feedTagCategory: FeedTagCategory;
}
