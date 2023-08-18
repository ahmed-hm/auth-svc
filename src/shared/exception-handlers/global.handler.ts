import { Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class GlobalHandler extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalHandler.name);

  catch(exception: HttpException, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = exception.getStatus?.() ?? 500;
    const payload = exception.getResponse?.() ?? 'Internal server error';

    this.logger.error(exception);

    response.status(statusCode).json({
      statusCode,
      payload,
    });
  }
}
