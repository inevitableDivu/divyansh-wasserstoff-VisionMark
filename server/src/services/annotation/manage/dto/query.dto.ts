import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { AnnotationStatus } from 'src/models/image.schema';

export class PaginationQueryDto {
	@ApiProperty({ required: false })
	@IsNumber()
	@IsOptional()
	page_number: number = 1;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(10)
	@Max(50)
	@IsOptional()
	per_page: number = 10;
}

export class ApprovalBodyDto {
	@ApiProperty()
	@IsMongoId()
	image_id: string;

	@ApiProperty()
	@IsEnum(AnnotationStatus)
	status: AnnotationStatus;
}

export enum ExportFormat {
	CSV = 'csv',
	JSON = 'json',
}

export class ExportQueryDto extends PaginationQueryDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsEnum(ExportFormat)
	format: ExportFormat = ExportFormat.JSON;
}
