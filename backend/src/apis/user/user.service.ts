import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Region } from '../region/entities/region.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { getToday } from '../../commons/libraries/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      relations: ['region'],
    });
  }

  async load({ nickname }) {
    const result = await this.userRepository.findOne({
      where: { nickname: nickname },
      relations: ['region'],
    });

    return result;
  }

  async fetch({ email }) {
    const result = await this.userRepository.findOne({
      where: { email: email },
      relations: ['region'],
    });

    return result;
  }

  async overLapEmail({ email }) {
    const result = await this.userRepository.findOne({ email });
    if (result) {
      throw new ConflictException('중복된 이메일입니다.');
    } else if (email === undefined || !email.includes('@')) {
      throw new UnprocessableEntityException('이메일이 올바르지 않습니다.');
    }

    return '사용가능한 이메일입니다.';
  }

  async overLapNic({ nickname }) {
    const result = await this.userRepository.findOne({ nickname });
    if (result) throw new ConflictException('중복된 닉네임입니다.');

    return '사용가능한 닉네임입니다.';
  }

  async create({ createUserInput }) {
    const { regionId, nickname, ...userInfo } = createUserInput;
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });

    const emailBody = `
      <html>
      <body>
        <h1></h1>
        <p align="center">
          <img
            src="https://capsule-render.vercel.app/api?&type=waving&color=timeAuto&height=180&section=header&text=${nickname}님 가입을 축하드립니다!&fontSize=50&animation=fadeIn&fontAlignY=45"
          />
        </p>
        <p align="center" fontSize="150">
          <a href="https://naver.com" >온도衣에서 오늘의 착장 자랑하기</a>
        </p>
        <p align="center">
          <img
            width="450"
            src="https://p0.pikist.com/photos/293/633/field-tree-village-collections-spring-landscape-rural-forest-yields-nature.jpg"
          />
        </p>
    
        <div align="center">
          ${nickname}님의 가입을 축하드립니다. 많은 활동 부탁드립니다
        </div>
        <div align="center">가입일: ${getToday()}</div>
      </body>
    </html>
      `;
    const appKey = process.env.EMAIL_APP_KEY;
    const XSecretKey = process.env.EMAIL_X_SECRET_KEY;
    const sender = process.env.EMAIL_SENDER;

    const emailSend = await axios.post(
      `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`,
      {
        senderAddress: sender,
        title: '온도衣 가입을 환영합니다!',
        body: emailBody,
        receiverList: [
          { receiveMailAddr: userInfo.email, receiveType: 'MRT0' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );
    return await this.userRepository.save({
      ...userInfo,
      region,
      nickname,
    });
  }

  async update({ currentEmail, updateUserInput }) {
    const nic = await this.userRepository.find();
    const { regionId, ...rest } = updateUserInput;
    const updateUser = await this.userRepository.findOne({
      where: { email: currentEmail },
      relations: ['region'],
    });
    const isAuthNic = updateUserInput.nickname;

    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });

    for (let i = 0; i < nic.length; i++) {
      if (isAuthNic === nic[i]['nickname']) {
        throw new UnprocessableEntityException('이미 사용중인 닉네임입니다.');
      }
    }

    const newUser: User = {
      ...updateUser,
      region,
      ...rest,
    };
    return await this.userRepository.save(newUser);
  }

  async updatePassword({ originPassword, updatePassword, currentEmail }) {
    const user = await this.userRepository.findOne({ email: currentEmail });

    const isAuth = await bcrypt.compare(originPassword, user.password);

    if (!isAuth)
      throw new UnprocessableEntityException('현재 비밀번호가 틀렸습니다.');

    if (user.password) user.password = await bcrypt.hash(updatePassword, 10);

    return this.userRepository.save(user);
  }

  async delete({ currentUserEmail }) {
    const result = await this.userRepository.delete({
      email: currentUserEmail,
    });

    return result.affected ? true : false;
  }

  async send({ phone }) {
    if (phone.length !== 10 && phone.length !== 11)
      throw new UnprocessableEntityException('핸드폰 번호가 알맞지 않습니다.');

    let tokenCount = 6;
    const token = String(Math.floor(Math.random() * 10 ** tokenCount)).padStart(
      tokenCount,
      '0',
    );

    await this.cacheManager.set(`${token}`, token, {
      ttl: 180,
    });

    const appKey = process.env.SMS_APP_KEY;
    const XSecretKey = process.env.SMS_X_SECRET_KEY;
    const sender = process.env.SMS_SENDER;

    const sendSms = await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
      {
        body: `[온도衣]본인확인 인증번호[${token}]입니다. "타인 노출 금지"`,
        sendNo: sender,
        recipientList: [{ internationalRecipientNo: phone }],
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Secret-Key': XSecretKey,
        },
      },
    );

    return '전송완료';
  }

  async confirm({ authNumber }) {
    const result = await this.cacheManager.get(`${authNumber}`);
    if (result == authNumber) {
      return '인증완료';
    } else {
      return '인증번호를 다시 확인해 주세요.';
    }
  }
}
