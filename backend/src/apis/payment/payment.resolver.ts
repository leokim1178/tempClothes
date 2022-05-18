import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { PaymentButton } from './entities/payment.entity';
import { PaymentButtonService } from './payment.service';

@Resolver()
export class PaymentButtonResolver {
  constructor(
    private readonly paymentButtonService: PaymentButtonService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PaymentButton)
  async createButton(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.paymentButtonService.buy({ impUid, amount, currentUser });
  }
}
