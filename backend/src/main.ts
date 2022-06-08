import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception-filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    credentials: true,
    origin: 'http://tempclothes.site',
  });
  app.useStaticAssets(join(__dirname, '..', 'chat'));
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
