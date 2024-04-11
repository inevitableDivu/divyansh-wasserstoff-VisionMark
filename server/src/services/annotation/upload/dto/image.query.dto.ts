import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class ImageQueryDto {
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

export class VerticesDto {
	@ApiProperty()
	@IsNumber()
	x: number;

	@ApiProperty()
	@IsNumber()
	y: number;

	@ApiProperty()
	@IsNumber()
	width: number;

	@ApiProperty()
	@IsNumber()
	height: number;
}

export class AnnotationDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsObject()
	vertices: VerticesDto;
}

export class ManualAnnotationBodyDto {
	@ApiProperty({ type: [AnnotationDto], required: true })
	@IsArray()
	annotations: AnnotationDto[];
}
