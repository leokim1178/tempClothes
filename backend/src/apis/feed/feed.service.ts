import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedLike } from '../feedLike/entities/feedLike.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Region } from '../region/entities/region.entity';
import { User } from '../user/entities/user.entity';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(FeedTag)
    private readonly feedTagRepository: Repository<FeedTag>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FeedImg)
    private readonly feedImgRepository: Repository<FeedImg>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    private readonly connection: Connection,
  ) {}

  async findWithRegion({ regionId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.region', 'region') // 지역정보를 조인하고 'region'으로 명명
      .where({ region: regionId }) // 지역정보 필터링 조건 추가
      .leftJoinAndSelect('Feed.feedTag', 'feedTag') // 피드 태그들 조인
      .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
      .leftJoinAndSelect('Feed.feedLike', 'feedLike') // 좋아요 테이블 조인
      .leftJoinAndSelect('Feed.user', 'user') // 유저 테이블 조인
      .orderBy('Feed.watchCount', 'DESC') // 조회수 기준으로 내림차순으로 정렬
      .getMany();

    return result;
  }

  async findWithTags({ feedTags, regionId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.region', 'region') // 지역정보를 조인하고 'region'으로 명명
      .where({ region: regionId }) // 지역정보 필터링 조건 추가
      .leftJoinAndSelect('Feed.user', 'user') // 유저 테이블 조인
      .leftJoinAndSelect('Feed.feedTag', 'feedTag') // 피드 태그들을 조인하고 'feedTag'로 명명
      .andWhere('feedTag.tagName IN (:tagName)', {
        tagName: feedTags,
      }) // andWhere로 조건 추가 태그들이 들어간 feedTags로 IN 조회
      .leftJoinAndSelect('Feed.feedImg', 'feedImg') //피드 이미지들 조인
      .leftJoinAndSelect('Feed.feedLike', 'feedLike') // 좋아요 테이블 조인
      .orderBy('Feed.watchCount', 'DESC') // 조회수 기준으로 내림차순으로 정렬
      .getMany();
    console.log(result);

    return result;
  }

  async findWithUser({ userId }) {
    const result = await this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.user', 'user') // 유저정보 조인하고 'user'로 명명
      .where({ user: userId }) // 유저정보 필터링 조건 추가
      .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
      .leftJoinAndSelect('Feed.feedLike', 'feedLike') // 좋아요 테이블 조인
      .orderBy('Feed.watchCount', 'DESC') // 조회수 기준으로 내림차순으로 정렬
      .getMany();
    console.log(result);

    return result;
  }

  async findWithFeedId({ feedId }) {
    const feed = await this.feedRepository
      .createQueryBuilder('Feed')
      .where({ id: feedId }) // id로 조회
      .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
      .leftJoinAndSelect('Feed.comment', 'feedComment') // 피드 댓글들 조인
      .leftJoinAndSelect('Feed.feedLike', 'feedLike') // 좋아요 테이블 조인
      .leftJoinAndSelect('Feed.feedTag', 'feedTag') // 피드 태그들 조인
      .leftJoinAndSelect('Feed.region', 'region') // 지역 테이블 조인
      .leftJoinAndSelect('Feed.user', 'user') // 유저 테이블 조인
      .getOne();
    const result = await this.feedRepository.save({
      ...feed,
      watchCount: feed.watchCount + 1, // 조회 수 증가
    });

    return result;
  }

  async like({ userId, feedId }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // 0. 좋아요 관계 형성 유무 확인
      // const feedLike = await this.feedLikeRepository.findOne({
      //   where: { user: userId, feed: feedId },
      // });
      const feedLike = await queryRunner.manager.findOne(
        FeedLike, //
        { user: userId, feed: feedId },
        { lock: { mode: 'pessimistic_write' } },
      );
      // 1. 유저정보와 피드 정보 조회
      //유저 정보 조회(일반 findOne으로 해도 무관)

      const user = await this.userRepository.findOne({
        userId,
      }); // 유저 정보 조회
      //피드 정보 조회
      const feed = await queryRunner.manager.findOne(
        Feed,
        { id: feedId },
        { lock: { mode: 'pessimistic_write' } },
      );
      // const user = await this.userRepository.findOne({
      //   userId,
      // }); // 유저 정보 조회

      // const feed = await this.feedRepository.findOne({
      //   id: feedId,
      // }); //피드 정보 조회

      if (!user || !feed) throw new ConflictException('잘못된 요청입니다');
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
        console.log('🚀🚀🚀🚀🚀', feedLike.isLike);
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
    } finally {
      await queryRunner.release();
    }
  }

  async create({ userId, createFeedInput }) {
    const { feedTag, regionId, ...feed } = createFeedInput;

    const region = await this.regionRepository.findOne({
      id: regionId,
    });
    if (!region) throw new ConflictException('등록되지 않은 지역명입니다');

    const tagResult = [];
    for (let i = 0; i < feedTag.length; i++) {
      const tagName = feedTag[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag); // tag가 이미 존재하면 저장하지 않고 추가
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
        });
        tagResult.push(newTag); // 없으면 db에 저장 후 추가
      }
    }

    const user = await this.userRepository.findOne({ where: { userId } });
    const feedSaveResult = await this.feedRepository.save({
      ...feed,
      region: region,
      feedTag: tagResult,
      user,
    });

    return feedSaveResult;
  }

  async update({ feedId, updateFeedInput }) {
    const lastFeed = await this.feedRepository.findOne({
      where: {
        id: feedId,
      },
    });
    if (!lastFeed) throw new ConflictException('등록되지 않은 피드입니다 ');

    const { feedTag, regionId, ...feed } = updateFeedInput;
    const tagResult = [];

    for (let i = 0; i < feedTag.length; i++) {
      const tagName = feedTag[i];
      const prevTag = await this.feedTagRepository.findOne({
        where: { tagName },
      });
      if (prevTag) {
        tagResult.push(prevTag); // tag가 이미 존재하면 저장하지 않고 추가
      } else {
        const newTag = await this.feedTagRepository.save({
          tagName,
        });
        tagResult.push(newTag); // 없으면 db에 저장 후 추가
      }
    }
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });
    const feedUpdateResult = await this.feedRepository.save({
      ...lastFeed,
      ...feed,
      region: region,
      feedTag: tagResult,
    });
    return feedUpdateResult;
  }

  async delete({ feedId }) {
    const feed = await this.feedRepository.findOne({ id: feedId });
    if (!feed) throw new ConflictException('존재하지 않는 피드입니다');
    const feedLike = await this.feedLikeRepository.find({
      where: { feed: feedId },
    });

    // await Promise.all(
    //   feedLike.map((el) => {
    //     this.feedLikeRepository.delete({ id: el.id });
    //   }),
    // );

    // const imgs = await this.feedImgRepository.find({ where: { feed: feedId } });

    // await Promise.all(
    //   imgs.map((el) => {
    //     this.feedImgRepository.delete({ id: el.id });
    //   }),
    // ); // 피드 삭제시 이미지 먼저 삭제

    // const comments = await this.commentRepository.find({
    //   where: { feed: feedId },
    // });

    // await Promise.all(
    //   comments.map((el) => {
    //     this.commentRepository.delete({ id: el.id });
    //   }),
    // ); // 피드 삭제시 댓글 먼저 삭제

    const result = await this.feedRepository.softDelete({ id: feedId });
    return result.affected ? true : false;
  }
}
