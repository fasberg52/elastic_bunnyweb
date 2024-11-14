import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from '../../common/dto/query.dto';

export class GetAllProjectDto extends QueryDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	status: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	category: string;

	@ApiPropertyOptional()
	@IsOptional()
	dateRange?: { start: string; end: string };
}
