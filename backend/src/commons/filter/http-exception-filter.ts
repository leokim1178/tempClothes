import { ExceptionFilter, HttpException } from '@nestjs/common';

export class HttpExceptionFilter implements ExceptionFilter {
  //두개의 클래스를 상속하는 다중상속은 지원하지않는다
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;
    console.log('========');
    console.log('에러가 발생했어요!');
    console.log('에러내용!', message);
    console.log('에러가 발생했어요!', status);
    console.log('========');
  }
}
