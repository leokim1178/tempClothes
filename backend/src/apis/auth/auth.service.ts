import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserInput } from '../user/dto/createUser.input';
import { UserService } from '../user/user.service';

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
      { userId: user.userId, sub: user.email }, // payload 확인후 변경하기
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    // 쿠키 저장 설정
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=team01-leo3179.shop.graphql; SameSite=None; Secure; httpsOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { userId: user.userId, sub: user.email },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '10h' }, // 테스트 하려고  15s로 해놓음,, 나중에 바꿔놓자
    );
  }

  //   async socialLogin({ req, res }) { // 소셜로그인 할때 만지기
  //     // 1.가입확인
  //     let user = await this.userService.findOne({ email: req.user.email });

  // 2. 회원가입

  // if (!user) {
  //   const createUser = new createRentUserInput();
  //   console.log(createUser);

  //   user = await this.rentUserService.create({
  //     // 위에 유저에서 유저가 없다면, 값을 넣어줘야 하기 때문에 user = 로 설정 해줌.
  //     createRentUserInput: req.user,
  //   });
  // }

  //   // 3. 로그인
  //   this.setRefreshToken({ user, res }); //authService를 지정 안해도 되는 이유는 자기 자신 안에 있기 때문에, 지정을 해줄 필요가 없다.

  //   res.redirect(
  //     'http://localhost:5500/homework/main-project/frontend/login/index.html',
  //   );
  // }

  async socialLogin({ req, res }) {
    //1. 가입확인
    const user = await this.userService.findOne({ userId: req.user.userId });
    // const hashedPW = //
    //     await bcrypt.hash(req.user.password, 10).then((res) => res);
    //2. 회원가입
    if (!user) {
      // const newUser: createUserInput = {
      //   userId: '소셜 로그인',
      //   email: req.user.email,
      //   password: req.user.password,
      //   nickname: req.user.name,
      // };
      // // const result = await this.userService.create({ newUser });
    }

    //3. 로그인
    //로그인 시키는 것 : access와 refresh 두개 던지기
    this.setRefreshToken({ user, res });

    res.redirect('http://localhost:3000/tempClothes');
  }
}
