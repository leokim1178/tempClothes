import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Feed } from 'src/apis/feed/entities/feed.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  commentDetail: string;

  @ManyToOne(() => Feed, (feed) => feed.comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Feed)
  feed: Feed;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE', //
    onUpdate: 'CASCADE',
  })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comment, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  }) // 자기참조
  @Field(() => Comment, { nullable: true })
  pComment: Comment;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
