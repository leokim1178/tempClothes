import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedImgService } from '../feedImg/feedImg.service';
import { FeedLike } from '../feedLike/entities/feedLike.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Region } from '../region/entities/region.entity';
import { User } from '../user/entities/user.entity';
import { fetchFeedOutput } from './dto/fetchFeedOutput';
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
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    private readonly connection: Connection,
    private readonly feedImgService: FeedImgService,
  ) {}

  async findWithFeedId({ feedId }) {
    try {
      const feed = await this.feedRepository
        .createQueryBuilder('Feed')
        .where({ id: feedId }) // id로 조회
        .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
        .leftJoinAndSelect('Feed.comment', 'comment') // 피드 댓글들 조인
        .leftJoinAndSelect('Feed.feedLike', 'feedlike') // 좋아요 테이블 조인
        .leftJoinAndSelect('feedlike.user', 'likeuser') // 유저 조인
        .leftJoinAndSelect('Feed.feedTag', 'feedTag') // 피드 태그들 조인
        .leftJoinAndSelect('Feed.region', 'region') // 지역 테이블 조인
        .leftJoinAndSelect('Feed.user', 'user') // 유저 테이블 조인
        .getOne();

      if (!feed) throw new NotFoundException('피드 정보가 존재하지않습니다');

      const result: Feed = await this.feedRepository.save({
        ...feed,
        watchCount: feed.watchCount + 1, // 조회 수 증가 처리
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findWithTags({ region, feedTags, page }) {
    try {
      const qb = this.feedRepository
        .createQueryBuilder('Feed')
        .leftJoinAndSelect('Feed.region', 'region') // 지역정보를 조인하고 'region'으로 명명
        .where({ region: region }) // 지역정보 필터링 조건 추가
        .leftJoinAndSelect('Feed.user', 'user') // 유저 테이블 조인
        .leftJoinAndSelect('Feed.feedTag', 'feedTag') // 피드 태그들을 조인하고 'feedTag'로 명명
        .leftJoinAndSelect('Feed.feedImg', 'feedImg'); //피드 이미지들 조인
      if (!feedTags) {
        // 태그 검색어가 없을 시 지역 검색으로 종결
        const paging = qb.orderBy('Feed.watchCount', 'DESC'); // 조회수 기준으로 내림차순으로 정렬
        if (page) {
          // 페이지 분류 필요시
          const result = await paging
            .take(10)
            .skip((page - 1) * 10)
            .getManyAndCount();
          const [feeds, total] = result;
          const output: fetchFeedOutput = { feeds, total, count: 10, page };
          return output;
        } else {
          // 페이지 분류가 필요없을 시
          const result = await paging.getManyAndCount();
          const [feeds, total] = result;
          const output: fetchFeedOutput = { feeds, total };
          return output;
        }
      } else {
        // 태그 검색어가 존재할 때 지역으로 검색한 결과를 다시 태그로 검색
        const paging = qb
          .andWhere('feedTag.tagName IN (:tags)', {
            tags: feedTags,
          }) // andWhere로 조건 추가 태그들이 들어간 feedTags로 IN 조회
          .orderBy('Feed.watchCount', 'DESC'); // 조회수 기준으로 내림차순으로 정렬

        if (page) {
          // 페이지 분류 필요시
          const result = await paging
            .take(10)
            .skip((page - 1) * 10)
            .getManyAndCount();
          const [feeds, total] = result;
          const output: fetchFeedOutput = { feeds, total, count: 10, page };
          return output;
        } else {
          // 페이지 분류가 필요없을 시
          const result = await paging.getManyAndCount();
          const [feeds, total] = result;
          const output: fetchFeedOutput = { feeds, total };
          return output;
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findMyFeeds({ currentUser, page }) {
    try {
      const qb = this.feedRepository
        .createQueryBuilder('Feed')
        .leftJoinAndSelect('Feed.user', 'user') // 유저정보 조인하고 'user'로 명명
        .where({ user: currentUser }) // 유저정보 필터링 조건 추가
        .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
        .orderBy('Feed.watchCount', 'DESC'); // 조회수 기준으로 내림차순으로 정렬
      if (page) {
        // 페이지 분류 필요시
        const result = await qb
          .take(10)
          .skip((page - 1) * 10)
          .getManyAndCount();
        const [feeds, total] = result;
        const output: fetchFeedOutput = { feeds, total, page, count: 10 };
        return output;
      } else {
        // 페이지 분류가 필요없을 시
        const result = await qb.getManyAndCount();
        const [feeds, total] = result;
        const output: fetchFeedOutput = { feeds, total };
        return output;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findUserFeeds({ userNickname, page }) {
    const user = await this.userRepository.findOne({
      where: { nickname: userNickname },
    });
    if (!user)
      throw new UnprocessableEntityException('해당 회원이 존재하지 않습니다');

    const qb = this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.user', 'user') // 유저정보 조인하고 'user'로 명명
      .where({ user: user.id }) // 유저정보 필터링 조건 추가
      .leftJoinAndSelect('Feed.feedImg', 'feedImg') // 피드 이미지들 조인
      .orderBy('Feed.watchCount', 'DESC'); // 조회수 기준으로 내림차순으로 정렬
    if (page) {
      // 페이지 분류 필요시
      const result = await qb
        .take(10)
        .skip((page - 1) * 10)
        .getManyAndCount();
      const [feeds, total] = result;
      const output: fetchFeedOutput = { feeds, total, page, count: 10 };
      return output;
    } else {
      // 페이지 분류가 필요없을 시
      const result = await qb.getManyAndCount();
      const [feeds, total] = result;
      const output: fetchFeedOutput = { feeds, total };
      return output;
    }
  }

  async create({ currentUser, createFeedInput }) {
    const { feedTags, regionId, imgURLs, ...feed } = createFeedInput; // 구조분해할당

    const region = await this.regionRepository.findOne({
      id: regionId,
    });
    if (!region) throw new NotFoundException('등록되지 않은 지역명입니다');

    const user = await this.userRepository.findOne({
      email: currentUser.email,
    });
    if (!user) throw new NotFoundException('등록되지 않은 유저입니다');

    //중요 엔티티므로 create에 transaction 적용

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const tagResult = [];
      for (let i = 0; i < feedTags.length; i++) {
        const tagName = feedTags[i];
        const prevTag = await queryRunner.manager.findOne(FeedTag, {
          where: { tagName },
        });
        if (prevTag) {
          const updateTag = await queryRunner.manager.save(FeedTag, {
            ...prevTag,
            count: prevTag.count + 1,
          });

          tagResult.push(updateTag); // tag가 이미 존재하면 저장하지 않고 추가
        } else {
          const newTag = this.feedTagRepository.create({
            tagName,
          });
          await queryRunner.manager.save(newTag);
          tagResult.push(newTag); // 없으면 db에 저장 후 추가
        }
      }

      const feedResult = await queryRunner.manager.save(Feed, {
        ...feed,
        feedTag: tagResult,
        region,
        user,
      });

      const images = await Promise.all(
        imgURLs.map((el) => {
          const saveFeedImg = this.feedImgRepository.create({
            imgURL: el,
            feed: feedResult,
          });
          return queryRunner.manager.save(saveFeedImg);
        }),
      );

      await queryRunner.commitTransaction();
      return feedResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update({ feedId, updateFeedInput }) {
    const lastFeed = await this.feedRepository.findOne({
      where: {
        id: feedId,
      },
    });
    if (!lastFeed) throw new NotFoundException('존재하지 않는 피드입니다');
    try {
      const { feedTags, imgURLs, regionId, ...feed } = updateFeedInput;

      const region = await this.regionRepository.findOne({
        where: { id: regionId },
      });
      if (!region) throw new NotFoundException('지역명을 입력하세요');

      if (feedTags) {
        const tagResult = [];
        for (let i = 0; i < feedTags.length; i++) {
          const tagName = feedTags[i];
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

        const feedUpdateResult = await this.feedRepository.save({
          ...lastFeed,
          ...feed,
          region,
          feedTag: tagResult,
        });

        const imgUpdateResult = await this.feedImgService.updateImg({
          feedId: feedUpdateResult.id,
          imgURLs,
        });

        return feedUpdateResult;
      } else {
        const feedUpdateResult = await this.feedRepository.save({
          ...lastFeed,
          ...feed,
          feed,
          region,
        });

        const imgUpdateResult = await this.feedImgService.updateImg({
          feedId: feedUpdateResult.id,
          imgURLs,
        });

        return feedUpdateResult;
      }
    } catch (error) {
      throw error;
    }
  }

  async delete({ feedId }) {
    const feed = await this.feedRepository.findOne({ id: feedId });
    if (!feed) throw new NotFoundException('존재하지 않는 피드입니다');

    try {
      const feedTags = feed.feedTag;
      await Promise.all(
        feedTags.map((el) => {
          this.feedTagRepository.update(
            { tagName: el.tagName },
            { count: () => 'count-1' },
          );
        }),
      );
      const result = await this.feedRepository.delete({ id: feedId });
      return result.affected ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
