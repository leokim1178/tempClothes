import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';

@Entity()
@ObjectType()
export class SubComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  subDetail: string;

  @ManyToOne(() => Comment) // 댓글
  @Field(() => Comment)
  comment: Comment;

  @ManyToOne(() => User) // 유저
  @Field(() => User)
  subComUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
