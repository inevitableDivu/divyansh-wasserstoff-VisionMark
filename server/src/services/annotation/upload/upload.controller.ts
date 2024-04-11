import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	Get,
	Param,
	ParseFilePipeBuilder,
	Post,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { FirebaseService } from 'src/helper/firebase.service';
import { ImageQueryDto, ManualAnnotationBodyDto } from './dto/image.query.dto';
import { UploadService } from './upload.service';
import { Throttle, ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Image Annotation')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('annotate/image')
export class UploadController {
	constructor(
		private readonly storage: FirebaseService,
		private readonly uploadService: UploadService,
	) {}

	@Post('upload')
	@UseGuards(ThrottlerGuard)
	@Throttle({ default: { limit: 2, ttl: 60000 } })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				image: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('image'))
	async handleUpload(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({ fileType: new RegExp('.(bmp|ico|jpe?g|png|webp|svg)$') })
				.build(),
		)
		file: Express.Multer.File,
		@Req() request: Request,
	) {
		const user_id = request.user._id;
		const is_existing = await this.storage.checkImageExistence(user_id, file);

		if (is_existing) throw new ConflictException('Image already exists');

		const { path, url, name } = await this.storage.uploadImage(user_id, file);

		const image_doc = await this.uploadService.handleUpload(user_id, file, name, path, url);

		// TODO: trigger event to start annotation process for premium members

		return this.uploadService.serializeImage(image_doc);
	}

	@Get('list')
	async handleUploadsList(@Req() request: Request, @Query() query: ImageQueryDto) {
		const user_id = request.user._id;

		const list = (await this.uploadService.getUploadsList(user_id, query)) ?? [];
		return {
			total_images: list.length,
			list,
		};
	}

	@Get(':id')
	async getImageAnnotationDetails(@Req() request: Request, @Param('id') image_id: string) {
		if (!isMongoId(image_id)) throw new BadRequestException('Invalid image id');

		const user_id = request.user._id;

		const image = await this.uploadService.getImageDetailsById(image_id, user_id);
		return image;
	}

	@Post('manual/:id')
	async manualAnnotation(
		@Req() request: Request,
		@Param('id') image_id: string,
		@Body() body: ManualAnnotationBodyDto,
	) {
		if (!isMongoId(image_id)) throw new BadRequestException('Invalid image id');

		const user_id = request.user._id;

		return await this.uploadService.manualAnnotation(user_id, image_id, body);
	}
}
