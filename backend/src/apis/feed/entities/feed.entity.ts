import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FeedTag } from 'src/apis/feedTag/entities/feedTag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: 0 })
  @Field(() => Int, { nullable: true })
  rank: number;

  @Column({ type: 'longtext' })
  @Field(() => String)
  detail: string;

  @JoinTable()
  @ManyToMany(() => FeedTag, (feedTags) => feedTags.feeds, { cascade: true })
  @Field(() => [FeedTag])
  feedTags: FeedTag[];

  //   @ManyToOne(() => Region)
  //   @Field(() => Region)
  //   region: Region;
}
