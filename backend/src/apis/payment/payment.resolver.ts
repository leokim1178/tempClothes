import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
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
    @Args('amount', { type: () => Int }) amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const token = await this.iamportService.getToken();

    await this.iamportService.checkpaid({ imp_uid, amount, token });

    await this.paymentButtonService.checkOverlap({ imp_uid });

    return this.paymentButtonService.buy({
      imp_uid,
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
    await this.paymentButtonService.checkAlreadyCanceled({ imp_uid });

    await this.paymentButtonService.checklist({
      imp_uid,
      currentUser,
    });

    const token = await this.iamportService.getToken();
    const canceledButton = await this.iamportService.cancel({ imp_uid, token });

    return await this.paymentButtonService.cancel({
      imp_uid,
      amount: canceledButton,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async payChat(@CurrentUser() currentUser: ICurrentUser) {
    return await this.paymentButtonService.pay({ currentUser });
  }
}
