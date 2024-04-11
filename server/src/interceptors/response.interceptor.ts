import {
	CallHandler,
	ExecutionContext,
	Global,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Global()
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();
		return next.handle().pipe(
			map((response) => {
				let message = response?.message || 'Request Successfull!';
				delete response?.message;

				const path = request.url.split('?')[0];
				const search = request.url.split('?')?.[1]
					? '?' + request.url.split('?')[1]
					: undefined;

				return {
					response: response || null,
					message,
					path,
					search,
					timestamp: new Date().toISOString(),
				};
			}),
		);
	}
}
