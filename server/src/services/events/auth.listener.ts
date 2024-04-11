import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Details } from 'express-useragent';
import { TokenEnum } from 'src/models/helper.models';
import { Token, TokenModel } from 'src/models/token.schema';
import { getDeviceType } from 'src/utils';

export class TokenCreation {
	token: string;
	user_id: string;
	type: TokenEnum = TokenEnum.REFRESH_TOKEN;

	platform: string;
	os: string;
	browser: string;
	browser_version: string;
	source: string;
	device_type: string;
	ip: string;

	constructor(user_id: string, token: string, user_agent: Details, ip: string, type?: TokenEnum) {
		this.token = token;
		this.user_id = user_id;
		this.type = type || this.type;

		this.browser = user_agent.browser;
		this.browser_version = user_agent.version;
		this.os = user_agent.os;
		this.platform = user_agent.platform;
		this.source = user_agent.source;
		this.device_type = getDeviceType(user_agent);
		this.ip = user_agent.isBot ? '0.0.0.0' : ip;
	}
}

@Injectable()
export class AuthListener {
	constructor(@InjectModel(Token.name) private readonly tokenModel: TokenModel) {}

	@OnEvent('auth.token.created')
	async handleTokenCreatedEvent(payload: TokenCreation) {
		try {
			await this.tokenModel.create({ ...payload });
		} catch (error) {
			// TODO: Log error to a file
			console.log('Error creating token', error);
		}
	}
}
