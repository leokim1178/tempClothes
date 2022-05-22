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
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  comment: string;

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

  @ManyToOne(() => Comment, { cascade: true, onDelete: 'CASCADE' }) // 자기참조
  @Field(() => Comment)
  pComment: Comment;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
