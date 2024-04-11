import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnnotationStatus, Image, ImageModel } from 'src/models/image.schema';
import { ApprovalBodyDto, PaginationQueryDto } from './dto/query.dto';

@Injectable()
export class AdminAnnotateService {
	constructor(@InjectModel(Image.name) private readonly image: ImageModel) {}

	fetchImageList(query: PaginationQueryDto) {
		return this.image
			.find()
			.limit(query.per_page)
			.skip(query.per_page * (query.page_number - 1))
			.exec();
	}

	handleAnnotationApproval(body: ApprovalBodyDto) {
		return this.image.updateOne(
			{ _id: body.image_id },
			{ $set: { status: AnnotationStatus.APPROVED } },
		);
	}

	exportAnnotations(query: PaginationQueryDto) {
		return this.image
			.find({
				status: AnnotationStatus.APPROVED,
			})
			.limit(query.per_page)
			.skip(query.per_page * (query.page_number - 1))
			.exec();
	}
}
