import { Field, ObjectType } from '@nestjs/graphql';
import { Feed } from 'src/apis/feed/entities/feed.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @ManyToOne(() => Feed, (feed) => feed.feedImg, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @Field(() => Feed)
  feed: Feed;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
