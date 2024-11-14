import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../common/dto/query.dto';

export class GetAllCategoryDto extends PartialType(QueryDto) {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	status: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	parentId: string;

	@ApiPropertyOptional()
	@IsOptional()
	dateRange?: { start: string; end: string };
}
