import { AsyncParser } from '@json2csv/node';
import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import { AdminAnnotateService } from './admin.annotate.service';
import { ApprovalBodyDto, ExportFormat, ExportQueryDto, PaginationQueryDto } from './dto/query.dto';

@ApiBearerAuth()
@UseGuards(AdminGuard)
@ApiTags('Admin Annotation Management')
@Controller('admin/annotation/manage')
export class AdminAnnotationController {
	constructor(private readonly manage: AdminAnnotateService) {}

	@Get('list')
	async fetchImageList(@Query() query: PaginationQueryDto) {
		const images = (await this.manage.fetchImageList(query)) || [];
		return {
			count: images.length,
			page_number: query.page_number,
			images,
		};
	}

	@Post('review')
	async handleManageApproval(@Body() body: ApprovalBodyDto) {
		const approved = await this.manage.handleAnnotationApproval(body);
		if (!approved) throw new NotFoundException('Image not found with the provided ID');

		// TODO: notify image owner of the approval

		return {
			image_id: body.image_id,
			message: 'Annotation status updated successfully',
		};
	}

	@Get('export')
	async handleExport(@Query() query: ExportQueryDto, @Res() response: Response) {
		const images = (await this.manage.exportAnnotations(query)) || [];

		if (query.format === ExportFormat.CSV) {
			const rawData = JSON.stringify(images);
			const parser = new AsyncParser();
			const csv = await parser.parse(rawData).promise();
			response.setHeader('Content-Type', 'text/csv');
			response.setHeader(
				'Content-Disposition',
				`attachment; filename=Export-Annotation-${new Date().getTime()}.csv`,
			);
			response.send(csv);
			return;
		}

		response.setHeader('Content-Type', 'text/json');
		response.setHeader(
			'Content-Disposition',
			`attachment; filename=Export-Annotation-${new Date().getTime()}.json`,
		);
		response.send(images);
	}
}
