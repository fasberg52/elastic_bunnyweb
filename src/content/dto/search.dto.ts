import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ApiExtraModels()
export class SearchContentDto {
	@ApiPropertyOptional()
	keyword?: string;

	@ApiPropertyOptional({ default: 1 })
	page?: number = 1;

	@ApiPropertyOptional({ default: 10 })
	limit?: number = 10;

	@ApiProperty()
	query: string;
}
