import { Strategy } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    const naverClientID = process.env.NAVER_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET;
    super({
      clientID: naverClientID,
      clientSecret: naverClientSecret,
      callbackURL: 'https://team01.leo3179.shop/login/naver', // dev
      // callbackURL: 'https://t1dreamers.shop/login/naver', // prod
      // scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('1/////', accessToken);
    console.log('2/////', refreshToken);
    console.log(profile);

    return {
      email: profile.emails[0].value,
      password: '1111',
      nickname: profile.displayName,
      userImgURL: profile._json.profile_image,
    };
  }
}
