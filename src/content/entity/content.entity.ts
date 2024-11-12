import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseElasticEntity } from '../../common/base/base.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContentElasticEntity extends BaseElasticEntity {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	content: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	thumbnail: string;

	@ApiPropertyOptional()
	@IsArray()
	@IsOptional()
	images: { url: string; alt: string }[];

	@ApiPropertyOptional()
	@IsArray()
	@IsOptional()
	tags: string[];

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	categories: string[];
}
