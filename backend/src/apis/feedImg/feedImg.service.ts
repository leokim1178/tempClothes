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
    //1. feedId가 유효한지 확인

    const feed = await this.feedImgRepository.findOne({
      where: { id: feedId },
    });
    if (!feed)
      throw new UnprocessableEntityException('등록되지 않은 feedId입니다');

    //2. feedId에 해당되는 이미지들 불러오기
    const feedURLs = await this.feedImgRepository.find({
      where: { feed },
    });

    //3. feedId와 연결된 이미지 중 저장할 항목과 삭제할 항목 분리
    const newURLsArray = []; // 새롭게 저장해야하는 url들
    const pastURLs = []; //  이미 존재했던 url들

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
    // 저장할 항목( 입력한 url들 - 새롭게 저장해야하는 url들 )
    const newURLs = imgURLs.filter((el) => {
      return !newURLsArray.includes(el);
    });
    // 삭제할 항목( 이미 존재했던 url들 - 새롭게 저장해야하는 url들 )
    const forDelete = [
      // 중복 제거
      ...new Set(
        pastURLs.filter((el) => {
          return !newURLsArray.includes(el);
        }),
      ),
    ];

    // 4. 새로운 url들 저장
    await Promise.all(
      newURLs.map(async (el) => {
        return await this.feedImgRepository.save({
          feed,
          imgURL: el,
        });
      }),
    );

    // 5. 삭제할 url들 삭제
    await Promise.all(
      forDelete.map(async (el) => {
        return await this.feedImgRepository.delete({
          feed,
          imgURL: el,
        });
      }),
    );

    // 6. feed에 해당되는 이미지 다시 추출 후 전송
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
