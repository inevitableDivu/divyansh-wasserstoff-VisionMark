import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';
import { Document } from 'mongoose';
import { Configuration } from 'src/config/configuration';
import { User, UserModel } from 'src/models/user.schema';
import { CreateUserDto } from './dto/auth.dto';

export type Doc<T extends object> = Document<unknown, {}, T> &
	T &
	Required<{
		_id: string;
	}>;

@Global()
@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService<Configuration>,
		@InjectModel(User.name) private readonly userModel: UserModel,
	) {}

	getUserByEmail(email: string): Promise<Doc<User>> {
		return this.userModel.findOne({ email }).exec();
	}

	getUserById(_id: string): Promise<Doc<User>> {
		return this.userModel.findById(_id).exec();
	}

	async createUserWithEmailAndPassword({
		email,
		display_name,
		password,
	}: CreateUserDto): Promise<Doc<User>> {
		const salt = Buffer.from(randomBytes(16).toString('hex'));
		const hashedPassword = await this.hashPassword(password, salt);

		return this.userModel.create({
			display_name,
			email,
			password: hashedPassword,
			salt,
		});
	}

	hashPassword(password: string, salt: string | Buffer): Promise<string> {
		const password_secret = this.configService.get<string>('auth.password.secret');
		return hash(password, { salt, secret: Buffer.from(password_secret) });
	}

	validatePassword(password: string, hashedPassword: string): Promise<boolean> {
		const password_secret = this.configService.get<string>('auth.password.secret');
		return verify(hashedPassword, password, {
			secret: Buffer.from(password_secret),
		});
	}

	serializeUser(user: Doc<User>): User {
		const { password, salt, ...restUser } = ('_doc' in user ? user._doc : user) as User;

		return restUser as User;
	}
}
