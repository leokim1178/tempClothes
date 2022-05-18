import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Region } from '../region/entities/region.entity';
import * as bcrypt from 'bcrypt';

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
    const result = await this.userRepository.findOne({
      where: { userId },
      relations: ['region'],
    });

    console.log(result, '유저정보 찾기1');

    return result;
  }

  async fetch({ userId }) {
    // 유저 조회(피드와 유저 합치기)
    const result = await this.userRepository.findOne({
      where: { userId: userId },
      relations: ['region'],
    });

    console.log(result, '유저정보 찾기2');

    return result;
  }

  async overLapId({ userId }) {
    const result = await this.userRepository.findOne({ userId });
    if (result) throw new ConflictException('중복된 이메일입니다.');

    return '사용가능한 이메일입니다.';
  }

  async overLapNic({ nickname }) {
    const result = await this.userRepository.findOne({ nickname });
    if (result) throw new ConflictException('중복된 닉네임입니다.');

    return '사용가능한 닉네임입니다.';
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

  async update({ currentUserId, updateUserInput, password }) {
    const nic = await this.userRepository.find(); // 유저 정보 파인드
    const updateUser = await this.userRepository.findOne({
      where: { userId: currentUserId },
    });

    console.log(nic, '모든 유저 정보');

    const isAuthNic = updateUserInput.nickname;
    console.log(isAuthNic);
    for (let i = 0; i < nic.length; i++) {
      // 닉네임 중복 확인
      if (isAuthNic === nic[i]['nickname']) {
        throw new UnprocessableEntityException('이미 사용중인 닉네임입니다.');
      }
    }

    const isAuth = await bcrypt.compare(password, updateUser.password);
    if (!isAuth)
      throw new UnprocessableEntityException('현재 비밀번호가 틀렸습니다.');
    if (updateUserInput.password)
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password, // 변경 비밀번호 해싱
        10,
      );

    const newUser: User = {
      ...updateUser,
      ...updateUserInput,
    };
    return await this.userRepository.save(newUser);
  }

  async delete({ currentUserId }) {
    // const user = await this.userRepository.findOne({
    //   where: { userId: currentUserId },
    // });
    // console.log('ddd');

    // 일단 Softdelete로 대체;
    const result = await this.userRepository.softDelete({
      userId: currentUserId,
    });
    console.log(result, 'aaa');

    return result.affected ? true : false;
  }
}
