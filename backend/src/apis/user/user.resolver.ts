import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
// import { FeedService } from '../feed/feed.service';
import { User } from './entities/user.entity';
import { createUserInput } from './dto/createUser.input';
import { updateUserInput } from './dto/updateUser.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from '../../commons/auth/gql-user.param';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Query(() => [User]) // OOTD때, 전체 조회??(이 부분은 피드 부분?)
  fetchUsers() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard) // 로그인한 유저
  @Query(() => User) // 마이페이지 조회
  fetchUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.userService.fetch({ email: currentUser.email });
  }

  @Mutation(() => String) // 이메일 중복 확인
  confirmOverlapEmail(
    @Args('email') email: string, //
  ) {
    return this.userService.overLapEmail({ email });
  }

  @Mutation(() => String) // 닉네임 중복 확인
  confirmOverlapNic(
    @Args('nickname') nickname: string, //
  ) {
    return this.userService.overLapNic({ nickname });
  }

  @Mutation(() => User) // 유저 회원가입
  async createUser(
    @Args('createUserInput') createUserInput: createUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword; // 비밀번호 해싱
    return this.userService.create({
      createUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('password') password: string,
    @Args('updateUserInput') updateUserInput: updateUserInput,
  ) {
    const currentEmail = currentUser.email;
    return await this.userService.update({
      currentEmail,
      updateUserInput,
      password,
    });
  }

  @UseGuards(GqlAuthAccessGuard) // 로그인한 유저
  @Mutation(() => Boolean) // 회원탈퇴 API
  deleteUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    const currentUserEmail = currentUser.email;
    return this.userService.delete({ currentUserEmail }); // 피드서비스의 delete끌어옴.
  }

  @Mutation(() => String) // 인증번호 발송
  createPhoneAuth(
    @Args('phone') phone: string, //
  ){
    return this.userService.send({ phone })
  }

  @Mutation(() => String) // 인증번호 확인
  confirmAuthNumber(
    @Args('authNumber') authNumber: string, //
  ){
    return this.userService.confirm({ authNumber })
  }
}
