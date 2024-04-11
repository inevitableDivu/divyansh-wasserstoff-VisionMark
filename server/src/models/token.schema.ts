import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';

/* -------------------------- Internal Dependencies -------------------------- */
import { CommonSchema, DeviceType, TokenEnum } from './helper.models';
import { User } from './user.schema';

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class Token extends CommonSchema {
	@ApiProperty({ enum: TokenEnum, default: TokenEnum.REFRESH_TOKEN })
	@Prop({ enum: TokenEnum, default: TokenEnum.REFRESH_TOKEN, required: true })
	type: TokenEnum;

	@ApiProperty({ type: String, required: true })
	@Prop({ type: String, required: true, unique: true })
	token: string;

	@ApiProperty({ type: Types.ObjectId, required: true })
	@Prop({ required: true, ref: User.name, type: Types.ObjectId })
	user_id: Types.ObjectId;

	@ApiProperty()
	@Prop({ type: String, default: null })
	platform: string;

	@ApiProperty()
	@Prop({ type: String, default: null })
	os: string;

	@ApiProperty()
	@Prop({ type: String, default: null })
	browser: string;

	@ApiProperty()
	@Prop({ type: String, default: null })
	browser_version: string;

	@ApiProperty()
	@Prop({ type: String, default: null })
	source: string;

	@ApiProperty({ enum: DeviceType, default: DeviceType.MOBILE })
	@Prop({ enum: DeviceType, default: DeviceType.MOBILE })
	device_type: DeviceType;

	@ApiProperty({ default: '0.0.0.0' })
	@Prop({ default: null, type: String })
	ip: string;

	@ApiProperty({ default: false })
	@Prop({ default: false, type: Boolean })
	is_revoked: boolean;

	@ApiProperty({ default: null })
	@Prop({ type: Date, default: null })
	revoked_at: Date;

	@ApiProperty({ default: false })
	@Prop({ default: false, type: Boolean })
	is_expired: boolean;

	@ApiProperty({ default: null })
	@Prop({ type: Date, default: null })
	expired_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
export type TokenModel = Model<Token>;
