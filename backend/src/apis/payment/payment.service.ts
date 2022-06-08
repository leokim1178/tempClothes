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
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const buttonTransaction = await this.paymentButtonRepository.create({
        imp_uid: imp_uid,
        amount: amount / 100,
        user: currentUser.id,
        status: PAYMENT_BUTTON_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(buttonTransaction);

      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      const updateUser = this.userRepository.create({
        ...user,
        button: user.button + amount / 100,
      });
      await queryRunner.manager.save(updateUser);

      await queryRunner.commitTransaction();

      return buttonTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkOverlap({ imp_uid }) {
    const result = await this.paymentButtonRepository.findOne({ imp_uid });

    if (result) throw new ConflictException('이미 결제가 완료되었습니다.');
  }

  async checkAlreadyCanceled({ imp_uid }) {
    const result = await this.paymentButtonRepository.findOne({
      imp_uid,
      status: PAYMENT_BUTTON_STATUS_ENUM.CANCEL,
    });

    if (result) throw new ConflictException('이미 취소된 결제건입니다.');
  }

  async checklist({ imp_uid, currentUser }) {
    const result = await this.paymentButtonRepository.findOne({
      imp_uid,
      user: { id: currentUser.id },
      status: PAYMENT_BUTTON_STATUS_ENUM.PAYMENT,
    });

    if (!result)
      throw new UnprocessableEntityException('결제기록이 존재하지 않습니다.');
  }

  async cancel({ imp_uid, amount, currentUser }) {
    const queryRunner = await this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const user = await this.userRepository.findOne({
        where: { email: currentUser.email },
      });

      const updateUser = this.userRepository.create({
        ...user,
        button: user.button - amount / 100,
      });
      await queryRunner.manager.save(updateUser);

      const result = this.paymentButtonRepository.create({
        imp_uid,
        amount: -(amount / 100),
        user: { id: currentUser.id },
        status: PAYMENT_BUTTON_STATUS_ENUM.CANCEL,
      });

      await queryRunner.manager.save(result);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async pay({ currentUser }) {
    const user = await this.userRepository.findOne({
      where: { email: currentUser.email },
    });
    if (user.button >= 5) {
      const result = this.userRepository.create({
        ...user,
        button: user.button - 5,
      });

      const save = await this.userRepository.save(result);

      return result;
    } else {
      throw new UnprocessableEntityException('단추가 부족합니다!!');
    }
  }
}
