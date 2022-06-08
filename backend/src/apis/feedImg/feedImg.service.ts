import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Feed } from '../feed/entities/feed.entity';
import { FeedImg } from './entities/feedImg.entity';

@Injectable()
export class FeedImgService {
  constructor(
    @InjectRepository(FeedImg)
    private readonly feedImgRepository: Repository<FeedImg>,
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async create({ feedId, imgURLs }) {
    const feed = await this.feedRepository.findOne({ id: feedId });
    if (!feed)
      throw new UnprocessableEntityException('등록되지 않은 feedId입니다');
    const result = await Promise.all(
      imgURLs.map((el) => {
        return this.feedImgRepository.save({ imgURL: el, feed });
      }),
    );
    return result;
  }

  async updateImg({ feedId, imgURLs }) {
    const feed = await this.feedRepository.findOne({
      where: { id: feedId },
    });
    if (!feed)
      throw new UnprocessableEntityException('등록되지 않은 feedId입니다');

    const feedURLs = await this.feedImgRepository.find({
      where: { feed },
    });

    const newURLsArray = [];
    const pastURLs = [];

    for (let i = 0; i < imgURLs.length; i++) {
      await Promise.all(
        feedURLs.map(async (el) => {
          if (el.imgURL === imgURLs[i]) {
            newURLsArray.push(el.imgURL);
          } else {
            pastURLs.push(el.imgURL);
          }
        }),
      );
    }

    const newURLs = imgURLs.filter((el) => {
      return !newURLsArray.includes(el);
    });

    const forDelete = [
      ...new Set(
        pastURLs.filter((el) => {
          return !newURLsArray.includes(el);
        }),
      ),
    ];

    await Promise.all(
      newURLs.map(async (el) => {
        return await this.feedImgRepository.save({
          feed: feed,
          imgURL: el,
        });
      }),
    );

    await Promise.all(
      forDelete.map(async (el) => {
        return await this.feedImgRepository.delete({
          feed,
          imgURL: el,
        });
      }),
    );

    const saveResult = await this.feedImgRepository.find({
      where: { feed },
      relations: ['feed'],
    });

    return saveResult;
  }

  async delete({ feedImgId }) {
    const result = await this.feedImgRepository.delete({ id: feedImgId });
    return result.affected ? true : false;
  }
}
