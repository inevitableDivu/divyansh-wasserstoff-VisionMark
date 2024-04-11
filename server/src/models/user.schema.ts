import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommonSchema, Role } from './helper.models';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

@Schema({
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class User extends CommonSchema {
	@ApiProperty({ type: String, required: true })
	@Prop({ required: true })
	display_name: string;

	@ApiProperty({ type: String, required: true })
	@Prop({ required: true })
	email: string;

	@ApiProperty({ type: String, required: true })
	@Prop({ required: true })
	password: string;

	@Prop({ required: true, select: false })
	salt: string;

	@ApiProperty({ enum: Role, default: Role.USER })
	@Prop({ required: true, enum: Role, default: Role.USER })
	role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserModel = Model<User>;
