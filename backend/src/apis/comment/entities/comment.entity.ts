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
// import { Feed } from 'src/apis/feed/entities/feed.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  mainDetail: string;

  // @ManyToOne(() => Feed) // 피드
  // @Field(() => Feed)
  // feed: Feed;

  @ManyToOne(() => User) // 유저
  @Field(() => User)
  comUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
