import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HelperService } from 'src/helper/helper.service';
import { TokenEnum } from 'src/models/helper.models';
import { User } from 'src/models/user.schema';
import { AuthService, Doc } from 'src/services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly helper: HelperService,
		private readonly authService: AuthService,
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const access_token = this.getTokenFromBearerHeader(request);

		if (!isJWT(access_token)) return false;
		return this.validateUserToken(access_token, (user) => {
			request.user = this.authService.serializeUser(user);
		});
	}

	private getTokenFromBearerHeader(request: Request): string {
		const auth_header = request.headers.authorization;
		if (!auth_header) return '';

		const token = auth_header.split(' ')[1];
		return token;
	}

	private async validateUserToken(
		token: string,
		callback: (user: Doc<User>) => void,
	): Promise<boolean> {
		const payload = this.helper.decodeToken(TokenEnum.ACCESS_TOKEN, token);
		if (!payload) return false;

		const user = await this.authService.getUserById(payload.user_id);
		if (!user) return false;

		callback(user);

		return true;
	}
}
