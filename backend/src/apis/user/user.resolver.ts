import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { createUserInput } from './dto/createUser.input';
import { updateUserInput } from './dto/updateUser.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from '../../commons/auth/gql-user.param';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.userService.fetch({ email: currentUser.email });
  }

  @Query(() => User)
  fetchNickname(@Args('nickname') nickname: string) {
    return this.userService.load({ nickname });
  }

  @Mutation(() => String)
  confirmOverlapEmail(
    @Args('email') email: string, //
  ) {
    return this.userService.overLapEmail({ email });
  }

  @Mutation(() => String)
  confirmOverlapNic(
    @Args('nickname') nickname: string, //
  ) {
    return this.userService.overLapNic({ nickname });
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: createUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;
    return this.userService.create({
      createUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('updateUserInput') updateUserInput: updateUserInput,
  ) {
    const currentEmail = currentUser.email;
    return await this.userService.update({
      currentEmail,
      updateUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updatePassword(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('originPassword') originPassword: string,
    @Args('updatePassword') updatePassword: string,
  ) {
    const currentEmail = currentUser.email;
    return await this.userService.updatePassword({
      originPassword,
      updatePassword,
      currentEmail,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    const currentUserEmail = currentUser.email;
    return this.userService.delete({ currentUserEmail });
  }

  @Mutation(() => String)
  createPhoneAuth(
    @Args('phone') phone: string, //
  ) {
    return this.userService.send({ phone });
  }

  @Mutation(() => String)
  confirmAuthNumber(
    @Args('authNumber') authNumber: string, //
  ) {
    return this.userService.confirm({ authNumber });
  }
}
