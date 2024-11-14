import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseElasticEntity } from '../../common/base/base.entity';
import { CategoryTypeEnum } from '../enum/type.enum';

export class CategoryElasticEntity extends BaseElasticEntity {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	image: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	slug: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	parentId?: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	status: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	level: number;

	@ApiProperty({ enum: CategoryTypeEnum })
	@IsEnum(CategoryTypeEnum)
	@IsNotEmpty()
	type: CategoryTypeEnum;
}
