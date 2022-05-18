import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
