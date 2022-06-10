import { Field, ObjectType } from '@nestjs/graphql';
import { FeedTag } from 'src/apis/feedTag/entities/feedTag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class FeedTagCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  categoryName: string;

  @OneToMany(() => FeedTag, (feedTag) => feedTag.feedTagCategory, {
    cascade: true,
  })
  @Field(() => [FeedTag], { nullable: true })
  feedTag: FeedTag[];
}
