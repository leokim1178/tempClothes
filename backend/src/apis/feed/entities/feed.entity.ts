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
  DeleteDateColumn,
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

  @Column({ type: 'longtext' }) // 길게 쓰고 싶을때!
  @Field(() => String)
  detail: string;

  @Column({ default: 0 })
  @Field(() => Int, { nullable: true })
  likeCount: number;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  top?: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  bottom?: string;

  @Column({ default: null })
  @Field(() => String, { nullable: true })
  outer?: string;

  @Column({ nullable: true, default: null })
  @Field(() => String, { nullable: true })
  etc?: string;

  @JoinTable()
  @ManyToMany(() => FeedTag, (feedTags) => feedTags.feed, {
    eager: true,
    cascade: true,
  })
  @Field(() => [FeedTag])
  feedTag: FeedTag[];

  @OneToMany(() => FeedImg, (feedImg) => feedImg.feed, {
    cascade: true, // 주가 되는 객체에!, ondelete: 'cascade'는 1:n에서 n 쪽에 걸어준다.
    orphanedRowAction: 'delete', // 부모 없으면 죽는거
  })
  @Field(() => [FeedImg])
  feedImg: FeedImg[];

  @OneToMany(() => Comment, (comment) => comment.feed, {
    cascade: true,
    orphanedRowAction: 'delete',
    nullable: true,
  })
  @Field(() => [Comment])
  comment: Comment[];

  @OneToMany(() => FeedLike, (feedLike) => feedLike.feed, {
    cascade: true,
    orphanedRowAction: 'delete',
    nullable: true,
  })
  @Field(() => [FeedLike], { nullable: true })
  feedLike: FeedLike[];

  @ManyToOne(() => Region, {
    onDelete: 'CASCADE',
  })
  @Field(() => Region)
  region: Region;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;

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
