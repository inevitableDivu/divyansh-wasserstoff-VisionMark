import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HelperService } from 'src/helper/helper.service';
import { TokenEnum } from 'src/models/helper.models';
import { User } from 'src/models/user.schema';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(
		private readonly helper: HelperService,
		private readonly authService: AuthService,
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const access_token = this.getTokenFromBearerHeader(request);
		const admin_token = request.cookies[TokenEnum.ADMIN_TOKEN];

		if (!isJWT(admin_token)) return false;
		if (!isJWT(access_token)) return false;

		return this.validateAdmin(admin_token, access_token, (user) => {
			request.user = user;
		});
	}

	private getTokenFromBearerHeader(request: Request): string {
		const auth_header = request.headers.authorization;
		if (!auth_header) return '';

		const token = auth_header.split(' ')[1];
		return token;
	}

	private async validateAdmin(
		token: string,
		access_token: string,
		callback: (user: User) => void,
	) {
		const payload = this.helper.decodeToken(TokenEnum.ADMIN_TOKEN, token);
		const access_token_payload = this.helper.decodeToken(TokenEnum.ACCESS_TOKEN, access_token);
		if (!payload) return false;
		if (!access_token_payload) return false;

		const user = await this.authService.getUserById(payload.admin_id);
		if (!user) return false;

		callback(this.authService.serializeUser(user));

		return true;
	}
}
