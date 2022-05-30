import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { User } from '../user/entities/user.entity';
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
    }); // 유저 정보 조회

    const result = await this.feedLikeRepository.findOne({
      feed: feedId,
      user,
    });
    if (!result) throw new NotFoundException();

    return result.isLike;
  }

  async like({ currentUser, feedId }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // 0. 좋아요 관계 형성 유무 확인
      // const feedLike = await this.feedLikeRepository.findOne({
      //   where: { user: userId, feed: feedId },
      // });
      const feedLike = await queryRunner.manager.findOne(
        FeedLike, //
        { feed: feedId },
      );
      // 1. 유저정보와 피드 정보 조회
      //유저 정보 조회(일반 findOne으로 해도 무관)

      const user = await this.userRepository.findOne({
        email: currentUser.email,
      }); // 유저 정보 조회
      //피드 정보 조회
      const feed = await queryRunner.manager.findOne(Feed, { id: feedId });

      if (!feed || !user) throw new NotFoundException();
      //유저 정보가 없거나 피드 정보가 없을 경우 에러 쓰로잉

      if (!feedLike) {
        const updateLike = await this.feedLikeRepository.create({
          user,
          feed,
          isLike: true,
        });
        await queryRunner.manager.save(updateLike);

        const updateFeed = await this.feedRepository.create({
          ...feed,
          likeCount: feed.likeCount + 1,
        });
        await queryRunner.manager.save(updateFeed);
        await queryRunner.commitTransaction();

        return true;
      } else {
        if (feedLike.isLike) {
          const updateLike = await this.feedLikeRepository.create({
            ...feedLike,
            user,
            feed,
            isLike: false,
          });
          await queryRunner.manager.save(updateLike);

          const updateFeed = await this.feedRepository.create({
            ...feed,
            likeCount: feed.likeCount - 1,
          });
          await queryRunner.manager.save(updateFeed);
          await queryRunner.commitTransaction();

          return false;
        } else {
          const updateLike = await this.feedLikeRepository.create({
            ...feedLike,
            user,
            feed,
            isLike: true,
          });
          await queryRunner.manager.save(updateLike);

          const updateFeed = await this.feedRepository.create({
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
      if (error.status == 404)
        throw new NotFoundException('등록되지 않은 정보입니다');
      throw new InternalServerErrorException('서버 에러');
    } finally {
      await queryRunner.release();
    }
  }
}
