import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserInput } from '../user/dto/createUser.input';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,
  ) {}

  setRefreshToken({ user, res }) {
    // payload값 만들기
    const refreshToken = this.jwtService.sign(
      // 쿠키에 저장 할것이기 때문에 변수를 지정하여 쿠키 설정 할 곳에 매개변수로 넣어준다.
      { email: user.email, sub: user.id }, // payload 확인후 변경하기
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    // 쿠키 저장 설정
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=team01.leo3179.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '10h' }, // 테스트 하려고  15s로 해놓음,, 나중에 바꿔놓자
    );
  }

  async socialLogin({ req, res }) {
    //1. 가입확인
    const hashedPW = //
      await bcrypt.hash(req.user.password, 10).then((res) => res);

    let user = await this.userService.fetch({ email: req.user.email });
    if (!user) {
      const createUserInput: createUserInput = {
        email: req.user.email,
        gender: null,
        phone: null,
        nickname: req.user.nickname,
        password: hashedPW,
        userImgURL: req.user.userImgURL,
        regionId: null,
        style: null,
      };
      user = await this.userService.create({ createUserInput });
      this.setRefreshToken({ user, res });
      await res.redirect('http://localhost:3000/signup');
    } else {
      if (!user.gender || !user.phone || !user.region || !user.style) {
        this.setRefreshToken({ user, res });
        await res.redirect('http://localhost:3000/signup');
      } else {
        this.setRefreshToken({ user, res });
        await res.redirect('http://localhost:3000/tempClothes');
      }
    }
  }
}
