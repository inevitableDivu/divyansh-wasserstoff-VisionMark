import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getExceptionCode } from 'src/helper/error.helper';
import { clearCookies } from 'src/utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception.getStatus();

		const exceptionResponse = exception.getResponse();
		let message: string;
		if (typeof exceptionResponse === 'string') message = exception.message;
		else {
			let messageResponse =
				'message' in exceptionResponse
					? (exceptionResponse.message as Array<string>)
					: exception.message;
			message =
				typeof messageResponse === 'string' ? messageResponse : messageResponse.join(' | ');
		}

		const code = getExceptionCode(statusCode);
		if (code === 'TooManyRequestsException')
			message = 'Too many requests. Please try again later.';

		if (code === 'InternalServerErrorException')
			message = 'Oops! Seems like the server has crashed. Please try again later.';

		// clear cookies and un-authenticate if error occurs in refreshing the token
		if (request.url.endsWith('/token/refresh')) clearCookies(response);

		const path = request.url.split('?')[0];
		const query = request.url.split('?')?.[1];

		response.status(statusCode).json({
			message,
			path,
			code,
			statusCode,
			search: query ? '?' + query : query,
			timestamp: new Date().toISOString(),
		});
	}
}
