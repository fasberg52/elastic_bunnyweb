import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginateDto } from './paginate.dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto extends PartialType(PaginateDto) {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	keyword: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	query: string;
}
