import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
// import { AuthController } from './auth.controller';
// import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
// import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
// import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Region } from '../region/entities/region.entity';
import { JwtAcessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { UserResolver } from '../user/user.resolver';
import { FeedService } from '../feed/feed.service';
import { Feed } from '../feed/entities/feed.entity';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FeedLike } from '../feedLike/entities/feedLike.entity';

// import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
// import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
// import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User,
      Region,
      Feed,
      FeedTag,
      FeedImg,
      Comment,
      FeedLike,
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtAcessStrategy,
    // JwtGoogleStrategy,
    // JwtKakaoStrategy,
    // JwtNaverStrategy,
    AuthResolver,
    AuthService,
    UserService,
    UserResolver,
    FeedService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
