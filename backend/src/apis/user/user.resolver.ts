import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { createUserInput } from './dto/createUser.input';
import { updateUserInput } from './dto/updateUser.input';
import { UseGuards } from '@nestjs/common';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth-guard';
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
    return this.userService.fetch({ userId: currentUser.userId });
  }

  @Query(() => String) // 아이디 중복 확인
  fetchOverlapId(
    @Args('userId') userId: string, //
  ) {
    return this.userService.overLapId({ userId });
  }

  @Query(() => String) // 닉네임 중복 확인
  fetchOverlapNic(
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
    const currentUserId = currentUser.userId;
    console.log(currentUserId, '커랜트 유저아이디');
    return await this.userService.update({
      currentUserId,
      updateUserInput,
      password,
    });
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
