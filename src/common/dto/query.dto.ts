import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginateDto } from './paginate.dto';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryDto extends PartialType(PaginateDto) {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	keyword: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	query: string;

	@ApiProperty({ default: 'createdAt' })
	@IsString()
	@IsNotEmpty()
	sortField: string = 'createdAt';

	@ApiProperty({ default: 'desc' })
	@IsString()
	@IsNotEmpty()
	@IsIn(['asc', 'desc'])
	sortOrder?: 'asc' | 'desc' = 'desc';
}
