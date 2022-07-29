import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedImgService } from '../feedImg/feedImg.service';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { Region } from '../region/entities/region.entity';
import { User } from '../user/entities/user.entity';
import { fetchFeedOutput } from './dto/fetchFeed.output';
import { Feed } from './entities/feed.entity';

/**
 * Feed Service
 */

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
    private readonly connection: Connection,
    private readonly feedImgService: FeedImgService,
  ) {}

  async findWithFeedId({ feedId }) {
    try {
      const feed = await this.feedRepository
        .createQueryBuilder('Feed')
        .where({ id: feedId })
        .leftJoinAndSelect('Feed.feedImg', 'feedImg')
        .leftJoinAndSelect('Feed.comment', 'comment')
        .leftJoinAndSelect('Feed.feedLike', 'feedlike')
        .leftJoinAndSelect('feedlike.user', 'likeuser')
        .leftJoinAndSelect('Feed.feedTag', 'feedTag')
        .leftJoinAndSelect('Feed.region', 'region')
        .leftJoinAndSelect('Feed.user', 'user')
        .getOne();

      if (!feed) throw new NotFoundException('피드 정보가 존재하지않습니다');

      const result: Feed = await this.feedRepository.save({
        ...feed,
        watchCount: feed.watchCount + 1,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findWithTags({ region, feedTags, page }) {
    try {
      const qb = this.feedRepository
        .createQueryBuilder('Feed')
        .leftJoinAndSelect('Feed.region', 'region')
        .where({ region })
        .leftJoinAndSelect('Feed.user', 'user')
        .leftJoinAndSelect('Feed.feedTag', 'feedTag')
        .leftJoinAndSelect('Feed.feedImg', 'feedImg');
      if (!feedTags) {
        qb.orderBy('Feed.watchCount', 'DESC');
      } else {
        qb.andWhere('feedTag.tagName IN (:tags)', {
          tags: feedTags,
        }).orderBy('Feed.watchCount', 'DESC');
      }
      let output: fetchFeedOutput;
      if (page) {
        const result = await qb
          .take(10)
          .skip((page - 1) * 10)
          .getManyAndCount();
        const [feeds, total] = result;
        output = { feeds, total, count: 10, page };
      } else {
        const result = await qb.getManyAndCount();
        const [feeds, total] = result;
        output = { feeds, total };
      }
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findMyFeeds({ currentUser, page }) {
    try {
      const qb = this.feedRepository
        .createQueryBuilder('Feed')
        .leftJoinAndSelect('Feed.user', 'user')
        .where({ user: currentUser })
        .leftJoinAndSelect('Feed.feedImg', 'feedImg')
        .orderBy('Feed.watchCount', 'DESC');

      let output: fetchFeedOutput;
      if (page) {
        const result = await qb
          .take(10)
          .skip((page - 1) * 10)
          .getManyAndCount();
        const [feeds, total] = result;
        output = { feeds, total, page, count: 10 };
      } else {
        const result = await qb.getManyAndCount();
        const [feeds, total] = result;
        output = { feeds, total };
      }
      return output;
    } catch (error) {
      throw error;
    }
  }

  async findUserFeeds({ userNickname, page }) {
    const user = await this.checkExist({ userNickname });

    const qb = this.feedRepository
      .createQueryBuilder('Feed')
      .leftJoinAndSelect('Feed.user', 'user')
      .where({ user: user.id })
      .leftJoinAndSelect('Feed.feedImg', 'feedImg')
      .orderBy('Feed.watchCount', 'DESC');
    let output: fetchFeedOutput;
    if (page) {
      const result = await qb
        .take(10)
        .skip((page - 1) * 10)
        .getManyAndCount();
      const [feeds, total] = result;
      output = { feeds, total, page, count: 10 };
    } else {
      const result = await qb.getManyAndCount();
      const [feeds, total] = result;
      output = { feeds, total };
    }
    return output;
  }

  async create({ currentUser, createFeedInput }) {
    const { feedTags, regionId, imgURLs, ...feed } = createFeedInput;

    const region = await this.checkExist({ regionId });
    const user = await this.checkExist({ userEmail: currentUser.email });

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

          tagResult.push(updateTag);
        } else {
          const newTag = this.feedTagRepository.create({
            tagName,
          });
          await queryRunner.manager.save(newTag);
          tagResult.push(newTag);
        }
      }

      const feedResult = await queryRunner.manager.save(Feed, {
        ...feed,
        feedTag: tagResult,
        region,
        user,
      });

      await Promise.all(
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

  async update({ feed, updateFeedInput }) {
    const lastFeed = feed;
    try {
      const { feedTags, imgURLs, regionId, ...rest } = updateFeedInput;

      const region = await this.checkExist({ regionId });

      let feedUpdateResult: Feed;

      if (feedTags) {
        const tagResult = [];
        let excludeTag = lastFeed.feedTag.map((el) => el.tagName);
        const prevTags = lastFeed.feedTag.map((el) => el.tagName);

        for (let i = 0; i < feedTags.length; i++) {
          const tagName = feedTags[i];
          const prevTag = await this.feedTagRepository.findOne({
            where: { tagName },
          });

          if (prevTag) {
            let pushTag = prevTag;
            if (!prevTags.includes(tagName))
              pushTag = await this.feedTagRepository.save({
                ...prevTag,
                count: prevTag.count + 1,
              });

            tagResult.push(pushTag);
          } else {
            const newTag = await this.feedTagRepository.save({
              tagName,
            });
            tagResult.push(newTag);
          }

          excludeTag = excludeTag.filter((el) => el !== tagName);
        }

        await Promise.all(
          excludeTag.map((el) => {
            this.feedTagRepository.update(
              { tagName: el },
              { count: () => 'count-1' },
            );
          }),
        );

        feedUpdateResult = await this.feedRepository.save({
          ...lastFeed,
          ...rest,
          region,
          feedTag: tagResult,
        });
      } else {
        feedUpdateResult = await this.feedRepository.save({
          ...lastFeed,
          ...rest,
          region,
        });
      }

      await this.feedImgService.updateImg({
        feedId: feedUpdateResult.id,
        imgURLs,
      });

      return feedUpdateResult;
    } catch (error) {
      throw error;
    }
  }

  async delete({ feed }) {
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
      const result = await this.feedRepository.delete(feed);
      return result.affected ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async checkExist({
    feedId,
    userEmail,
    regionId,
    userNickname,
  }: {
    feedId?: string;
    userEmail?: string;
    regionId?: string;
    userNickname?: string;
  }) {
    if (feedId) {
      const feed = await this.feedRepository.findOne({ where: { id: feedId } });
      if (!feed) throw new NotFoundException('존재하지 않는 피드입니다');
      return feed;
    }
    if (userEmail) {
      const user = await this.userRepository.findOne({
        where: { email: userEmail },
      });
      if (!user) throw new NotFoundException('존재하지 않는 유저입니다');
      return user;
    }
    if (userNickname) {
      const user = await this.userRepository.findOne({
        where: { nickname: userNickname },
      });
      if (!user) throw new NotFoundException('존재하지 않는 유저입니다');
      return user;
    }
    if (regionId) {
      const region = await this.regionRepository.findOne({
        where: { id: regionId },
      });
      if (!region) {
        throw new NotFoundException('존재하지않는 지역명입니다');
      }
    }
  }
}
