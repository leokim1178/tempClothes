import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtAcessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Region } from '../region/entities/region.entity';
import { Feed } from '../feed/entities/feed.entity';
import { Comment } from '../comment/entities/comment.entity';
import { FeedService } from '../feed/feed.service';
import { FeedTag } from '../feedTag/entities/feedTag.entity';
import { FeedImg } from '../feedImg/entities/feedImg.entity';
import { FeedLike } from '../feedLike/entities/feedLike.entity';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User,
      Region,
      Feed,
      Comment,
      FeedTag,
      FeedImg,
      FeedLike,
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtAcessStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
    AuthResolver,
    AuthService,
    UserService,
    FeedService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
