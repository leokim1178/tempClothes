import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { PaymentButton } from './entities/payment.entity';
import { PaymentButtonResolver } from './payment.resolver';
import { PaymentButtonService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      PaymentButton,
    ]),
  ],
  providers: [
    PaymentButtonResolver, //
    PaymentButtonService,
    IamportService,
  ],
})
export class PaymentModule {}
