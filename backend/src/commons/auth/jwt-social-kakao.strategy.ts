import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    const kakaoClientID = process.env.KAKAO_CLIENT_ID;
    const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;
    super({
      clientID: kakaoClientID,
      clientSecret: kakaoClientSecret,
      callbackURL: 'https://team-project.leo3179.shop/login/kakao', // prod
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile._json.kakao_account.email,
      password: '1111',
      nickname: profile.displayName,
      userImgURL: profile._json.properties.thumbnail_image,
    };
  }
}
