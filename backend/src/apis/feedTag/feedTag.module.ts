import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedTag } from './entities/feedTag.entity';
import { FeedTagResolver } from './feedTag.resolver';
import { FeedTagService } from './feedTag.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedTag])],
  providers: [FeedTagResolver, FeedTagService],
})
export class FeedTagModule {}
