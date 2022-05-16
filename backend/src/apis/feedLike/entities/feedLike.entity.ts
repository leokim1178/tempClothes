import { Field, ObjectType } from '@nestjs/graphql';
import { Feed } from 'src/apis/feed/entities/feed.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class FeedLike {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isLike: boolean;

  @ManyToOne(() => Feed)
  @Field(() => Feed)
  feed: Feed;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
