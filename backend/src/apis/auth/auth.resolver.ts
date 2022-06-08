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
    private readonly userService: UserService,
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await this.userService.fetch({ email });
    if (!user)
      throw new UnprocessableEntityException('존재하지 않는 유저입니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호를 다시 확인하세요.');

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: any) {
    const access = context.req.headers.authorization.split(' ')[1];
    const refresh = context.req.headers.cookie.split('=')[1];

    try {
      const accessResult = jwt.verify(access, process.env.ACCESS_TOKEN_KEY);
      const refreshResult = jwt.verify(refresh, process.env.REFRESH_TOKEN_KEY);
      await this.cacheManager.set(`accessToken:${access}`, access, {
        ttl: accessResult['exp'] - accessResult['iat'],
      });
      await this.cacheManager.set(`refreshToken:${refresh}`, refresh, {
        ttl: refreshResult['exp'] - refreshResult['iat'],
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    return '정상적으로 로그아웃 되었습니다.';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
