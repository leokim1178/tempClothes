import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { createUserInput } from './dto/createUser.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/commons/auth/gql-user.param';

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
    // @CurrentUser() currentUser: any, // payload값 콘솔 찍고 확인 하고, 활성하기
    @Args('userId') userId: string, //
  ) {
    return this.userService.findOne({ userId });
  }

  @Query(() => String) // 아이디 중복 확인
  fetchOverlap(
    @Args('userId') userId: string, //
  ) {
    return this.userService.overLap({ userId });
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

  @UseGuards(GqlAuthAccessGuard) // 로그인한 유저, 인증 부분 확실해지면, 다시 확인.
  @Mutation(() => User)
  async updateUser(
    // @CurrentUser() // payload값 콘솔 찍고 확인 하고, 활성하기
    @Args('userId') userId: string,
    @Args('password') password: string, // 한솔님 오시면, 다시 수정
  ) {
    return '수정완료';
  }

  @UseGuards(GqlAuthAccessGuard) // 로그인한 유저
  @Mutation(() => Boolean) // 회원탈퇴 API
  deleteUser(
    // @CurrentUser() currentUser: any, //
    @Args('userId') userId: string, //
    @Args('password') password: string,
  ) {
    return this.userService.delete({ userId, password });
  }
}
