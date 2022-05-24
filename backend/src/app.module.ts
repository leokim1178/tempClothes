import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './apis/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { CommentModule } from './apis/comment/comment.module';
import { FeedImgModule } from './apis/feedImg/feedImg.module';
import { RegionModule } from './apis/region/region.module';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { PaymentModule } from './apis/payment/payment.module';
import { ChatModule } from './apis/chat/chat.module';
import { AppController } from './apis/app/app.controller';
import { AppService } from './apis/app/app.service';
import { FileModule } from './apis/file/file.module';
import { ChatGateway } from './apis/chat/chat.gateway';
import { FeedModule } from './apis/feed/feed.module';
import { CronModule } from './apis/cron/cron.module';

@Module({
  imports: [
    UserModule, // 유저 모듈
    CommentModule, // 댓글 모듈
    FeedModule, // 피드 모듈
    FeedImgModule, // 피드 이미지 모듈
    AuthModule, // 로그인 모듈
    RegionModule, // 지역 & 날씨 모듈
    PaymentModule, // 결제 모듈
    FileModule, // 파일 모듈
    ChatModule, // 채팅 시스템
    CronModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // // host: '10.118.112.4', // prod
      host: '10.82.224.4', // dev
      // host: 'my-database', // local
      port: 3306,
      username: 'root',
      password: '1234',
      // database: 't1', //prod
      database: 'team-01-database', // dev
      // database: 'team01-database', //local
      entities: [__dirname + '/apis/**/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      // url: 'redis://:dmCfbZ8b@10.140.0.4:6379', // prod
      url: 'redis://:fQrnzb8N@10.140.0.3:6379', // dev
      // url: 'redis://my-redis:6379', // local
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway], // 채팅 게이트웨이 넣기
})
export class AppModule {}
