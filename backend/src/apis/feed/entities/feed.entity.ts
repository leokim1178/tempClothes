import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { FeedImg } from 'src/apis/feedImg/entities/feedImg.entity';
import { FeedLike } from 'src/apis/feedLike/entities/feedLike.entity';
import { FeedTag } from 'src/apis/feedTag/entities/feedTag.entity';
import { Region } from 'src/apis/region/entities/region.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: 0 })
  @Field(() => Int, { nullable: true })
  watchCount: number;

  @Column({ type: 'longtext' })
  @Field(() => String)
  detail: string;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  likeCount: number;

  @JoinTable({})
  @ManyToMany(() => FeedTag, (feedTags) => feedTags.feed, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @Field(() => [FeedTag])
  feedTag: FeedTag[];

  @OneToMany(() => FeedImg, (feedImg) => feedImg.feed, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    createForeignKeyConstraints: true,
  })
  @Field(() => [FeedImg])
  feedImg: FeedImg[];

  @OneToMany(() => Comment, (comment) => comment.feed, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    createForeignKeyConstraints: true,
  })
  @Field(() => [Comment])
  comment: Comment[];

  @OneToMany(() => FeedLike, (feedLike) => feedLike.feed, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    createForeignKeyConstraints: true,
  })
  @Field(() => [FeedLike])
  feedLike: FeedLike[];

  @ManyToOne(() => Region)
  @Field(() => Region)
  region: Region;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
