import * as Annotate from '@google-cloud/vision';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Configuration } from 'src/config/configuration';
import { AnnotationDetails, AnnotationStatus, Image, ImageModel } from 'src/models/image.schema';

@Injectable()
export class AnnotationListener {
	constructor(
		@InjectModel(Image.name) private readonly imageModel: ImageModel,
		private readonly config: ConfigService<Configuration>,
	) {}

	@OnEvent('annotate.image')
	async handleTokenCreatedEvent(payload: { buffer: Buffer; url: string; image_id: string }) {
		let annotations: AnnotationDetails[] = [];

		let error: Error | null = null;

		try {
			console.log('starting annotation...');
			const annotator = new Annotate.v1.ImageAnnotatorClient({
				credentials: {
					type: 'service_account',
					project_id: this.config.get<string>('storage.project_id'),
					private_key: this.config
						.get<string>('vision.private_key')
						?.replace(/\\n/g, '\n'),
					client_email: this.config.get<string>('vision.client_email'),
				},
			});

			const response = await annotator.batchAnnotateImages({
				requests: [
					{
						image: {
							content: payload.buffer,
						},
						features: [
							{
								type: 'OBJECT_LOCALIZATION',
							},
						],
					},
				],
			});

			const { localizedObjectAnnotations } = response[0].responses[0];
			annotations =
				localizedObjectAnnotations.map((annotation) => {
					const vertices = annotation.boundingPoly.normalizedVertices;

					return {
						name: annotation.name,
						vertices: {
							x: vertices[0].x,
							y: vertices[0].y,
							width: vertices[2].x - vertices[0].x,
							height: vertices[2].y - vertices[0].y,
						},
					};
				}) || [];
		} catch (_err: any) {
			// TODO: Log error to a file
			error = _err;
			console.log(_err);
		}

		try {
			// TODO: notify user if there is an error in automatic annotation
			if (error) return;

			await this.imageModel.updateOne(
				{ _id: payload.image_id },
				{
					$push: {
						annotations: {
							$each: annotations,
						},
					},
					$set: {
						status: AnnotationStatus.APPROVAL_PENDING,
					},
				},
			);

			// TODO: notify user that the image has been annotated
		} catch (error) {
			// TODO: Log error to a file
			console.log(error);
		}
	}
}
