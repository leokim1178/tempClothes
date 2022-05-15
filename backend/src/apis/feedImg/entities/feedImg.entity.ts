import { Field, ObjectType } from '@nestjs/graphql';
import { Feed } from 'src/apis/feed/entities/feed.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class FeedImg {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  imgURL: string;

  @ManyToOne(() => Feed, (feed) => feed.feedImg)
  @Field(() => Feed)
  feed: Feed;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
