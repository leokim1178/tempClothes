import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import {
  PaymentButton,
  PAYMENT_BUTTON_STATUS_ENUM,
} from '../payment/entities/payment.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PaymentButtonService {
  constructor(
    @InjectRepository(PaymentButton)
    private readonly paymentButtonRepository: Repository<PaymentButton>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async buy({ imp_uid, amount, currentUser }) {
    // 트랜잭션
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect(); // 쿼리러너 커넥트

    // transaction 시작
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1. 테이블에 거래기록 1줄 생성
      const buttonTransaction = await this.paymentButtonRepository.create({
        imp_uid: imp_uid,
        amount: amount,
        user: currentUser.id, // 유저 아이디 저장
        status: PAYMENT_BUTTON_STATUS_ENUM.PAYMENT,
      });
      console.log(buttonTransaction, "PPP")

      await queryRunner.manager.save(buttonTransaction); // 쿼리 러너를 통해서 저장!

      // 2. 유저의 돈 조회하기
      const user = await queryRunner.manager.findOne(
        User, // 찾을 위치
        { id: currentUser.id }, // 조건
        { lock: { mode: 'pessimistic_write' } }, // 비관적락_쓰기(입력) 락 걸기
      );
        console.log(user, 'OOO')
      // 3. 유저의 돈 업데이트(재충전)
      const updateUser = this.userRepository.create({
        ...user,
        button: user.button + amount,
      });
      await queryRunner.manager.save(updateUser); // 재충전 후 저장

      // 4. commit 성공, try 성공
      await queryRunner.commitTransaction();

      // 5. 결과 반환
      return buttonTransaction;
      
    } catch (error) {
      // 1. 오류 났을때, 롤백 과정
      await queryRunner.rollbackTransaction();
    } finally {
      // 트랜잭션 연결 종료
      await queryRunner.release();
    }
  }

  async checkOverlap({ imp_uid }) {
    // 아임포트 imp_uid 중복 찾기
    const result = await this.paymentButtonRepository.findOne({ imp_uid });
    if (result) throw new ConflictException('이미 결제가 완료되었습니다.');
  }

  async checkAlreadyCanceled({ imp_uid }) {
    const result = await this.paymentButtonRepository.findOne({
      imp_uid,
      status: PAYMENT_BUTTON_STATUS_ENUM.CANCEL, // 어려운거 없이 이 status로 취소 됐는지 확인 가능
    });
    if (result) throw new ConflictException('이미 취소된 결제건입니다.');
  }

  async checklist({ imp_uid, currentUser }) {
    const result = await this.paymentButtonRepository.findOne({
      imp_uid,
      user: { id: currentUser.id },
      status: PAYMENT_BUTTON_STATUS_ENUM.PAYMENT, // 어려운거 없이 이 status로 취소 됐는지 확인 가능
    });
    console.log(result, "ccc")
    if (!result)
      throw new UnprocessableEntityException('결제기록이 존재하지 않습니다.');
  }

  async cancel({ imp_uid, amount, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 검증 후 DB저장하기
      const user = await this.userRepository.findOne({
        where: { email: currentUser.email },
      });
      console.log(user, 'cancel 유저정보');

      const updateUser = this.userRepository.create({
        // 환불 한 후 유저 남은 단추 업데이트
        ...user,
        button: user.button - amount,
      });
      console.log(updateUser, 'cancel 유저단추 업데이트');
      await queryRunner.manager.save(updateUser); // 재충전 후 저장

      const result = this.paymentButtonRepository.create({
        imp_uid,
        amount: -amount,
        user: { id: currentUser.id,},
        status: PAYMENT_BUTTON_STATUS_ENUM.CANCEL,
      });

      console.log(result, 'www')
      await queryRunner.manager.save(result);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
