import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => req.headers.cookie.replace('refreshToken=', ''),
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const result = await req.headers.cookie.split('=')[1];
    const result1 = `refreshToken:${result}`;
    const exist = await this.cacheManager.get(result1); // 키 자체가 토큰 값이 되있기 때문.
    // req에서 보내 온것이 이미 저장되어 있는 redis랑 같으면 오류지,, 이미 로그아웃한 토큰이니까
    if (exist) {
      throw new UnauthorizedException();
    } else {
      // 저장되어 있지 않아 유효한 토큰인 경우
      return {
        id: payload.sub,
        email: payload.email,
      };
    }
  }
}
