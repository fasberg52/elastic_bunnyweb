import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { BaseElasticEntity } from '../../common/base/base.entity';

export class ProjectElasticEntity extends BaseElasticEntity {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	thumbnail: string;

	@ApiPropertyOptional()
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	images: { url: string; alt: string }[];

	@ApiPropertyOptional()
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	tags: string[];

	@ApiPropertyOptional()
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	categories: string[];

	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	startDate: Date;

	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	endDate: Date;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	status: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	projectLink: string;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isActive: boolean;

	@ApiProperty()
	@IsBoolean()
	deleted: boolean = false;
}
