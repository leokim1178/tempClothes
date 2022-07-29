import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
import { fetchFeedLikeOutput } from './dto/fetchFeedLike.output';
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
    private readonly dataSource: DataSource,
  ) {}

  async find({ currentUser, feedId }) {
    const user = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });
    if (!user) throw new NotFoundException('등록되지 않은 유저입니다');
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });

    const result = await this.feedLikeRepository.findOne({
      where: {
        feed,
        user,
      },
      relations: ['user', 'feed'],
    });
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

  async like({ currentUser, feedId }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      const user = await this.userRepository.findOne({
        where: { email: currentUser.email },
      });

      const feed = await queryRunner.manager.findOne(Feed, {
        where: { id: feedId },
      });

      if (!feed) throw new NotFoundException('존재하지 않는 피드입니다');

      const feedLike = await this.feedLikeRepository
        .createQueryBuilder('feedLike')
        .leftJoin('feedLike.user', 'user')
        .leftJoin('feedLike.feed', 'feed')
        .where({ user })
        .andWhere({ feed })
        .getOne();

      let updateLike: FeedLike;
      let updateFeed: Feed;
      let likeStatus: boolean = null;

      if (!feedLike?.isLike || !feedLike) {
        // case 1.좋아요를 누르지 않은 상태
        // case 2.좋아요 관계가 형성되어있지 않은 상태
        // 좋아요 상태를 true로 변경하고 피드의 좋아요 수를 증가시킵니다
        updateLike = this.feedLikeRepository.create({
          ...feedLike,
          user,
          feed,
          isLike: true,
        });

        updateFeed = this.feedRepository.create({
          ...feed,
          likeCount: feed.likeCount + 1,
        });

        likeStatus = true;
      } else if (feedLike?.isLike) {
        // case 3. 이미 좋아요를 누른 상태
        // 좋아요 취소로 간주합니다
        // 좋아요 상태를 false로 변경하고 피드의 좋아요 수를 감소시킵니다
        updateLike = this.feedLikeRepository.create({
          ...feedLike,
          user,
          feed,
          isLike: false,
        });

        updateFeed = this.feedRepository.create({
          ...feed,
          likeCount: feed.likeCount - 1,
        });

        likeStatus = false;
      }

      if (likeStatus === null)
        throw new NotAcceptableException('좋아요 토글에 실패했습니다');

      await queryRunner.manager.save(updateLike);
      await queryRunner.manager.save(updateFeed);
      await queryRunner.commitTransaction();

      return likeStatus;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
