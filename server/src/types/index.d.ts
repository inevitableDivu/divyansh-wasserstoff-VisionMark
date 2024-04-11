declare global {
	namespace Express {
		interface Request {
			user?: import('src/models/user.schema').User;
		}
	}
}

export {};
