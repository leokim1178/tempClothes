import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Feed } from 'src/apis/feed/entities/feed.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  comment: string;

  @ManyToOne(() => Feed)
  @Field(() => Feed)
  feed: Feed;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comment) // 자기참조
  @Field(() => Comment)
  p_comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
