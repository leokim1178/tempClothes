import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserInput } from '../user/dto/createUser.input';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=server.t1dreamers.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '10h' },
    );
  }

  async socialLogin({ req, res }) {
    const hashedPW = await bcrypt
      .hash(req.user.password, 10)
      .then((res) => res);

    let user = await this.userService.fetch({ email: req.user.email });
    if (!user) {
      if (!req.user.email)
        throw new BadRequestException('email 정보가 없습니다 '); // 4xx에러(프론트쪽 에러라는 것을 알려주기 위함)
      if (!req.user.nickname)
        throw new BadRequestException('닉네임 값이 없습니다');

      const createUserInput: createUserInput = {
        email: req.user.email,
        gender: '성별을 입력해주세요', // 회원 정보를 추가적으로 입력해주기 위해 백엔드에 플레이스홀더 대신에 값을 줌.
        phone: '번호를 입력해주세요',
        nickname: req.user.nickname,
        password: hashedPW,
        userImgURL: req.user.userImgURL,
        regionId: '미선택',
        style: '스타일 정보를 입력해주세요',
      };
      user = await this.userService.create({ createUserInput });
      this.setRefreshToken({ user, res });
      await res.redirect('http://localhost:3000/signup');
    } else {
      if (
        user.gender === '성별을 입력해주세요' ||
        user.phone === '번호를 입력해주세요' ||
        user.region.id === '미선택' ||
        user.style === '스타일 정보를 입력해주세요'
      ) {
        this.setRefreshToken({ user, res });
        await res.redirect('http://localhost:3000/signup'); // 회원가입 할때 추가정보를 입력안했을때를 생각하여 리다이렉트 시켜주는 작업이다.
      } else {
        this.setRefreshToken({ user, res });
        await res.redirect('http://localhost:3000/tempClothes');
      }
    }
  }
}
