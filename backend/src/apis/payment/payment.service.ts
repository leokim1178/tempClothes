import { Injectable } from '@nestjs/common';
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

  async buy({ impUid, amount, currentUser }) {
    // 트랜잭션
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect(); // 쿼리러너 커넥트

    // transaction 시작
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // 1. 테이블에 거래기록 1줄 생성
      const buttonTransaction = await this.paymentButtonRepository.create({
        impUid: impUid,
        amount: amount,
        user: currentUser,
        status: PAYMENT_BUTTON_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(buttonTransaction); // 쿼리 러너를 통해서 저장!

      // 2. 유저의 돈 조회하기
      const user = await queryRunner.manager.findOne(
        User, // 찾을 위치
        { userId: currentUser.userId }, // 조건
        { lock: { mode: 'pessimistic_write' } }, // 비관적락_쓰기(입력) 락 걸기
      );

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
}
