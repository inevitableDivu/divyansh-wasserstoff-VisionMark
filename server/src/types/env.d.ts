declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: number | string;

			DATABASE_URL: string;
			DATABASE_NAME: string;

			ACCESS_TOKEN_SECRET_KEY: string;
			REFRESH_TOKEN_SECRET_KEY: string;
			PASSWORD_RESET_TOKEN_SECRET_KEY: string;
			ADMIN_TOKEN_SECRET: string;

			PASSWORD_SALT: string;
			PASSWORD_SECRET: string;

			// STORAGE VARIABLES
			FIREBASE_PROJECT_ID: string;
			FIREBASE_STORAGE_BUCKET: string;
			FIREBASE_SERVICE_PRIVATE_KEY: string;
			FIREBASE_SERVICE_CLIENT_EMAIL: string;

			// GOOGLE VISION API VARIABLES
			GOOGLE_CLOUD_VISION_PRIVATE_KEY: string;
			GOOGLE_CLOUD_VISION_CLIENT_EMAIL: string;
		}
	}
}

export {};
