import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth-guard';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('userId') userId: string, // 아이디로 로그인하기
    @Args('password') password: string,
    @Context() context: any,
  ) {
    // 1. 로그인(이메일과 비밀번호가 일치하는 유저 찾기)
    const user = await this.userService.findOne({ userId });
    // 2. 일치하는 유저가 없으면 에러!
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 유저입니다.');
    // 3. 일치하는 유저가 있지만, 암호가 틀린 경우 에러 던지기!!
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('비밀번호가 틀립니다.');

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
    this.authService.setRefreshToken({ user, res: context.res });

    // 5. 일치하는 유저가 있으면? accessToken(JWT)을  만들어서 프론트엔트한테 주기
    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: any, //
  ) {
    const access = context.req.headers.authorization.split(' ')[1];
    const refresh = context.req.headers.cookie.split('=')[1];

    try {
      const accessResult = jwt.verify(access, process.env.ACCESS_TOKEN_KEY);
      const refreshResult = jwt.verify(refresh, process.env.REFRESH_TOKEN_KEY);
      console.log(accessResult, '==========');
      console.log(refreshResult, '==========11'); // ['']
      console.log(accessResult['exp']); // 객체의 값 뽑아오기.
      await this.cacheManager.set(`accessToken:${access}`, access, {
        ttl: accessResult['exp'] - accessResult['iat'],
      });
      await this.cacheManager.set(`refreshToken:${refresh}`, refresh, {
        ttl: refreshResult['exp'] - refreshResult['iat'],
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    return '잘가라 샛꺄';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
