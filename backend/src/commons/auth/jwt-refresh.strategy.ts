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
      jwtFromRequest: (req) => req.headers.cookie?.replace('refreshToken=', ''),
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const result = await req.headers.cookie.split('=')[1];
    const result1 = `refreshToken:${result}`;
    const exist = await this.cacheManager.get(result1);

    if (exist) {
      throw new UnauthorizedException();
    } else {
      return {
        id: payload.sub,
        email: payload.email,
      };
    }
  }
}
