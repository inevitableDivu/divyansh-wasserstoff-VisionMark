import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { Configuration } from 'src/config/configuration';
import { Role, TokenEnum } from 'src/models/helper.models';

type TokenPayload<T extends TokenEnum> = T extends TokenEnum.ACCESS_TOKEN
	? {
			user_id: string;
			email: string;
		}
	: T extends TokenEnum.REFRESH_TOKEN
		? {
				token_id: string;
				user_id: string;
			}
		: T extends TokenEnum.PASSWORD_RESET_TOKEN
			? {}
			: T extends TokenEnum.ADMIN_TOKEN
				? {
						admin_id: string;
						role: Role;
					}
				: never;

@Global()
@Injectable()
export class HelperService {
	constructor(private readonly configService: ConfigService<Configuration>) {}

	clearCookies(response: Response, cookies: string | string[]) {
		if (typeof cookies === 'string') {
			response.clearCookie(cookies);
			return;
		}

		cookies.forEach((cookie) => {
			response.clearCookie(cookie);
		});
	}

	generateToken<T extends TokenEnum>(type: T, data: TokenPayload<T>) {
		return sign(data, this.configService.get<string>(`auth.token.${type}.secret`), {
			expiresIn: this.configService.get<string>(`auth.token.${type}.expiresIn`),
			algorithm: 'HS256',
			issuer: 'https://annotator.api.divyansh.co.in',
			audience: 'https://annotator.divyansh.co.in',
		});
	}

	decodeToken<T extends TokenEnum>(type: T, token: string): TokenPayload<T> | null {
		let payload: TokenPayload<T> | null = null;
		verify(
			token,
			this.configService.get<string>(`auth.token.${type}.secret`),
			(err, decoded) => {
				try {
					if (!err)
						payload = (
							typeof decoded === 'string' ? JSON.parse(decoded) : decoded
						) as TokenPayload<T>;
				} catch (error) {
					payload = null;
				}
			},
		);

		return payload;
	}
}
