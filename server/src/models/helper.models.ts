export class CommonSchema {
	__v: number;
	_id: string;
	created_at: Date;
	updated_at: Date;
}

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

export enum TokenEnum {
	REFRESH_TOKEN = 'refresh_token',
	ACCESS_TOKEN = 'access_token',
	PASSWORD_RESET_TOKEN = '____reset_TK',
	ADMIN_TOKEN = '____TK_admin__',
}

export type ITokenTypes = Record<TokenEnum, string | undefined>;

export enum DeviceType {
	MOBILE = 'mobile',
	TV = 'tv',
	TABLET = 'tablet',
	DESKTOP = 'desktop',
}
