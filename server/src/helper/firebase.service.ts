import { Global, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Configuration } from 'src/config/configuration';

@Global()
@Injectable()
export class FirebaseService {
	private static storageInstance: admin.storage.Storage;
	private static firebaseInstance: admin.app.App;
	constructor(private readonly config: ConfigService<Configuration>) {
		FirebaseService.firebaseInstance =
			admin.apps.length > 0
				? admin.app()
				: admin.initializeApp({
						credential: admin.credential.cert({
							clientEmail: this.config.get<string>('storage.client_email'),
							privateKey: this.config
								.get<string>('storage.private_key')
								.replace(/\\n/g, '\n'),
							projectId: this.config.get<string>('storage.project_id'),
						}),
						storageBucket: this.config.get<string>('storage.storage_bucket'),
					});

		FirebaseService.storageInstance = FirebaseService.firebaseInstance.storage();
	}

	async checkImageExistence(user_id: string, file: Express.Multer.File): Promise<boolean> {
		try {
			const bucket = FirebaseService.storageInstance.bucket(
				FirebaseService.storageInstance.bucket().name,
			);

			return await bucket.file(`annotation/${user_id}/${file.originalname}`).exists()[0];
		} catch (error) {
			// TODO: store error logs on server and handle it later
			throw new InternalServerErrorException();
		}
	}

	async uploadImage(
		user_id: string,
		file: Express.Multer.File,
	): Promise<{ url: string; path: string; name: string }> {
		return new Promise((resolve, reject) => {
			try {
				const file_name = `annotation-image_${new Date().getTime()}.${file.originalname.split('.').reverse()[0]}`;
				const bucket = FirebaseService.storageInstance.bucket();
				const fileUpload = bucket.file(`annotation/${user_id}/${file_name}`);
				const blobStream = fileUpload.createWriteStream({
					metadata: {
						contentType: file.mimetype,
					},
				});

				blobStream.on('error', (error) => {
					console.log(error.message);
					reject(new Error('Something is wrong! Unable to upload at the moment.'));
				});

				blobStream.on('finish', () => {
					let download_url = `https://firebasestorage.googleapis.com/v0/b/${this.config.get<string>('storage.storage_bucket')}/o/annotation%2F${user_id}%2F${encodeURI(file_name)}?alt=media`;
					resolve({
						name: file_name,
						url: download_url,
						path: `annotation/${user_id}/${file_name}`,
					});
				});

				blobStream.end(file.buffer);
			} catch (error) {
				console.log(error);
				reject(
					new InternalServerErrorException(
						'Something is wrong! Unable to upload at the moment.',
					),
				);
			}
		});
	}
}
