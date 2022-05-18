import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './apis/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { FeedModule } from './apis/feed/feed.module';
import { AuthModule } from './apis/auth/auth.module';
import { CommentModule } from './apis/comment/comment.module';
import { FeedImgModule } from './apis/feedImg/feedImg.module';
import { RegionModule } from './apis/region/region.module';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { PaymentModule } from './apis/payment/payment.module';

import { AppController } from './apis/app/app.controller';
import { AppService } from './apis/app/app.service';

@Module({
  imports: [
    UserModule, // 유저 모듈
    CommentModule, // 댓글 모듈
    FeedModule, // 피드 모듈
    FeedImgModule, // 피드 이미지 모듈
    AuthModule, // 로그인 모듈
    RegionModule, // 지역 & 날씨 모듈
    PaymentModule, // 결제 모듈

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: true,
        credentials: true,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.82.224.4',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'team-01-database',
      entities: [__dirname + '/apis/**/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://PcJvL6Vw@10.178.0.10:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
