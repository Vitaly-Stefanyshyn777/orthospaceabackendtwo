import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { MyLogger } from '../modules/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const logger = new MyLogger();
    logger.setContext(exception['name']);
    logger.error(exception['message']);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: any = { error: 'Internal server error' };

    if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
    } else if (exception['message']) {
      responseBody = { error: exception['message'] };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
