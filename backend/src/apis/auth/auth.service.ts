import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ user, res }) {
    // payload값 만들기
    const refreshToken = this.jwtService.sign(
      // 쿠키에 저장 할것이기 때문에 변수를 지정하여 쿠키 설정 할 곳에 매개변수로 넣어준다.
      { userId: user.userId, sub: user.email }, // payload 확인후 변경하기
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
      { userId: user.userId, sub: user.email },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '10h' }, // 테스트 하려고  15s로 해놓음,, 나중에 바꿔놓자
    );
  }

  async socialLogin({ req, res }) {
    //1. 가입확인
    console.log(req.user);

    // const hashedPW = //
    //     await bcrypt.hash(req.user.password, 10).then((res) => res);

    //2. 회원가입
    // if (!user) {
    // const newUser: createUserInput = {
    //   userId: '소셜 로그인',
    //   email: req.user.email,
    //   password: req.user.password,
    //   nickname: req.user.name,
    // };
    // // const result = await this.userService.create({ newUser });
    // }

    //3. 로그인
    // //로그인 시키는 것 : access와 refresh 두개 던지기
    // this.setRefreshToken({ user, res });

    res.redirect('https://naver.com');
  }
}
