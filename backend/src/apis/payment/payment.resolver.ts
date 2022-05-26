import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { PaymentButton } from './entities/payment.entity';
import { PaymentButtonService } from './payment.service';

@Resolver()
export class PaymentButtonResolver {
  constructor(
    private readonly paymentButtonService: PaymentButtonService, //
    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PaymentButton)
  async createButton(
    @Args('imp_uid') imp_uid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 검증단계
    // 1. 결제 완료기록 확인
    const token = await this.iamportService.getToken();
    // 2. 결제 금액이 맞는지 확인
    await this.iamportService.checkpaid({ imp_uid, amount, token });

    // 3. 중복 결제 체크
    await this.paymentButtonService.checkOverlap({ imp_uid });

    return this.paymentButtonService.buy({
      imp_uid, //
      amount,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PaymentButton)
  async cancelButton(
    @Args('imp_uid') imp_uid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 1. 이미 취소된 결제건인지 확인
    await this.paymentButtonService.checkAlreadyCanceled({ imp_uid });
    // 2. 결제 기록  확인
    await this.paymentButtonService.checklist({
      imp_uid,
      currentUser,
    });

    // 3. 실제 아임포트 취소하기
    const token = await this.iamportService.getToken();
    const canceledButton = await this.iamportService.cancel({ imp_uid, token });

    // 4. 테이블에 결제 취소 저장하기, 결제테이블 히스토리 관리 중요!
    return await this.paymentButtonService.cancel({
      imp_uid,
      amount: canceledButton,
      currentUser,
    });
  }

  // 채팅 결제 기능
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async payChat(
    @CurrentUser() currentUser: ICurrentUser,
  ){
    return await this.paymentButtonService.pay({ currentUser })
  }
}
