import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Region } from '../region/entities/region.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      relations: ['region'],
    });
  }

  async findOne({ userId }) {
    return await this.userRepository.findOne({
      where: { userId },
      relations: ['region'],
    });
  }

  async overLap({ userId }) {
    const result = await this.userRepository.findOne({ userId });
    if (result) throw new ConflictException('중복된 이메일입니다.');

    return '사용가능한 이메일입니다.';
  }

  async create({ createUserInput }) {
    const { regionId, ...userInfo } = createUserInput;
    console.log('정보');
    console.log(userInfo);
    console.log('지역', regionId);
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });

    return await this.userRepository.save({
      ...userInfo,
      region,
    });
  }

  async delete({ userId, password }) {
    const result = await this.userRepository.softDelete({ userId, password });
    return result.affected ? true : false;
  }
}
