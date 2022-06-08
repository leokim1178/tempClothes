import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // getStatus 대신에 그냥 서버오류로 바꾸기 위함(한번 찾아보자)
    const message = exception.message;
    console.log('==========');
    console.log('에러 발생!');
    console.log('에러코드: ', status);
    console.log('에러내용: ', message);
    console.log('==========');
  }
}
