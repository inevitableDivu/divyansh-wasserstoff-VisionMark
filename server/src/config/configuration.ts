import { TokenEnum } from 'src/models/helper.models';

export default function configuration() {
	return {
		port: parseInt(String(process.env.PORT), 10) || 3000,
		database: {
			url: process.env.DATABASE_URL,
			name: process.env.DATABASE_NAME,
		},

		auth: {
			password: {
				secret: process.env.PASSWORD_SECRET || '',
				salt: process.env.PASSWORD_SALT || '',
			},
			token: {
				[TokenEnum.ACCESS_TOKEN]: {
					secret: process.env.ACCESS_TOKEN_SECRET_KEY || '',
					expiresIn: '1d',
				},
				[TokenEnum.REFRESH_TOKEN]: {
					secret: process.env.REFRESH_TOKEN_SECRET_KEY || '',
					expiresIn: '30d',
				},
				[TokenEnum.PASSWORD_RESET_TOKEN]: {
					secret: process.env.PASSWORD_RESET_TOKEN_SECRET_KEY || '',
					expiresIn: '12m',
				},
				[TokenEnum.ADMIN_TOKEN]: {
					secret: process.env.ADMIN_TOKEN_SECRET || '',
					expiresIn: '1d',
				},
			},
		},
		storage: {
			project_id: process.env.FIREBASE_PROJECT_ID || '',
			storage_bucket: process.env.FIREBASE_STORAGE_BUCKET || '',
			private_key: process.env.FIREBASE_SERVICE_PRIVATE_KEY || '',
			client_email: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
		},
		vision: {
			private_key: process.env.GOOGLE_CLOUD_VISION_PRIVATE_KEY || '',
			client_email: process.env.GOOGLE_CLOUD_VISION_CLIENT_EMAIL || '',
		},
	};
}

type ConfigObj = ReturnType<typeof configuration>;

type PathImpl<T, K extends keyof T> = K extends string
	? T[K] extends Record<string, any>
		? T[K] extends Array<any>
			? `${K}.${number & string}`
			: `${K}.${PathImpl<T[K], keyof T[K]> & string}`
		: `${K}`
	: never;

type Path<T> = PathImpl<T, keyof T>;

// @ts-ignore
type ConfigPaths<T> = Path<{
	[K in keyof T]: T[K] extends Array<any> ? T[K] : T[K];
}>;

export type Configuration = Record<ConfigPaths<ConfigObj>, unknown>;
