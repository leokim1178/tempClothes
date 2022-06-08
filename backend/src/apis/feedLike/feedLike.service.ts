import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
import { fetchFeedLikeOutput } from './dto/fetchFeedLikeOutPut';
import { FeedLike } from './entities/feedLike.entity';

@Injectable()
export class FeedLikeService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    private readonly connection: Connection,
  ) {}

  async find({ currentUser, feedId }) {
    const user = await this.userRepository.findOne({
      email: currentUser.email,
    });
    if (!user) throw new NotFoundException('등록되지 않은 유저입니다');
    const feed = await this.feedRepository.findOne({
      id: feedId,
    });

    const result = await this.feedLikeRepository.findOne(
      {
        feed,
        user,
      },
      { relations: ['user', 'feed'] },
    );
    if (!result) {
      const saveFeedLike = await this.feedLikeRepository.save({
        feed,
        user,
      });
      const output: fetchFeedLikeOutput = {
        isLike: saveFeedLike.isLike,
        nickname: saveFeedLike.user.nickname,
        likeCount: saveFeedLike.feed.likeCount,
      };
      return output;
    }
    const output: fetchFeedLikeOutput = {
      isLike: result.isLike,
      nickname: result.user.nickname,
      likeCount: result.feed.likeCount,
    };
    return output;
  }

  async like({ currentUser, feedId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const feedLike = await queryRunner.manager.findOne(
        FeedLike, //
        { feed: feedId },
      );

      const user = await this.userRepository.findOne({
        email: currentUser.email,
      });

      const feed = await queryRunner.manager.findOne(Feed, { id: feedId });

      if (!feed || !user) throw new NotFoundException();

      if (!feedLike) {
        const updateLike = this.feedLikeRepository.create({
          user,
          feed,
          isLike: true,
        });
        await queryRunner.manager.save(updateLike);

        const updateFeed = this.feedRepository.create({
          ...feed,
          likeCount: feed.likeCount + 1,
        });
        await queryRunner.manager.save(updateFeed);
        await queryRunner.commitTransaction();

        return true;
      } else {
        if (feedLike.isLike) {
          const updateLike = this.feedLikeRepository.create({
            ...feedLike,
            user,
            feed,
            isLike: false,
          });
          await queryRunner.manager.save(updateLike);

          const updateFeed = this.feedRepository.create({
            ...feed,
            likeCount: feed.likeCount - 1,
          });
          await queryRunner.manager.save(updateFeed);
          await queryRunner.commitTransaction();

          return false;
        } else {
          const updateLike = this.feedLikeRepository.create({
            ...feedLike,
            user,
            feed,
            isLike: true,
          });
          await queryRunner.manager.save(updateLike);

          const updateFeed = this.feedRepository.create({
            ...feed,
            likeCount: feed.likeCount + 1,
          });
          await queryRunner.manager.save(updateFeed);
          await queryRunner.commitTransaction();

          return true;
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
