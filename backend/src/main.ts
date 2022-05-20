import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception-filter';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestApplication 소켓 통신을 위해 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  app.useStaticAssets(join(__dirname, '..', 'static')) // main.ts 채팅 설정(NestApplication)
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
