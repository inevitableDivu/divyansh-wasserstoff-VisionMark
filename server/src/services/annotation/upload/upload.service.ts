import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import getDimensions from 'buffer-image-size';
import { Image, ImageModel } from 'src/models/image.schema';
import { Doc } from 'src/services/auth/auth.service';
import { ImageQueryDto, ManualAnnotationBodyDto } from './dto/image.query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';

@Injectable()
export class UploadService {
	constructor(
		@InjectModel(Image.name) private readonly imageModel: ImageModel,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async handleUpload(
		user_id: string,
		file: Express.Multer.File,
		file_name: string,
		path: string,
		url: string,
	) {
		const { height, width } = await getDimensions(file.buffer);
		const image_id = new ObjectId();

		this.eventEmitter.emit('annotate.image', {
			buffer: file.buffer,
			url,
			image_id,
		});

		return this.imageModel.create({
			_id: image_id,
			path,
			file_name,
			url,
			original_name: file.originalname,
			size: file.size,
			user_id,
			dimensions: {
				height,
				width,
			},
		});
	}

	getUploadsList(user_id: string, query: ImageQueryDto) {
		return this.imageModel
			.find({ user_id })
			.limit(query.per_page)
			.skip(query.per_page * (query.page_number - 1));
	}

	getImageDetailsById(image_id: string, user_id: string) {
		return this.imageModel.findOne({ _id: image_id, user_id });
	}

	manualAnnotation(user_id: string, image_id: string, body: ManualAnnotationBodyDto) {
		return this.imageModel.findOneAndUpdate(
			{ _id: image_id, user_id },
			{
				$push: {
					annotations: {
						$each: body,
					},
				},
			},
			{ new: true },
		);
	}

	serializeImage(image: Doc<Image>) {
		const { path, user_id, ...restImage } = ('_doc' in image ? image._doc : image) as Image;

		return restImage;
	}
}
