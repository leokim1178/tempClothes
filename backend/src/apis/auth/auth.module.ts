// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthResolver } from './auth.resolver';
// import { AuthService } from './auth.service';
// import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
// import { AuthController } from './auth.controller';
// import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
// import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
// import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
// import { User } from '../user/entities/user.entity';
// import { UserService } from '../user/user.service';

// @Module({
//   imports: [
//     JwtModule.register({}), //
//     TypeOrmModule.forFeature([User]),
//   ],
//   providers: [
//     JwtRefreshStrategy,
//     JwtGoogleStrategy,
//     JwtKakaoStrategy,
//     JwtNaverStrategy,
//     AuthResolver, //
//     AuthService,
//     UserService,
//   ],
//   controllers: [
//     AuthController, //
//   ],
// })
// export class AuthModule {}
