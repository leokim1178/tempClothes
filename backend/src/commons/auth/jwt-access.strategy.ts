import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAcessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const result = await req.headers.authorization.split(' ')[1];
    const result1 = `accessToken:${result}`;
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
