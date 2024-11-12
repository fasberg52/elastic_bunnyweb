import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginateDto {
	@ApiProperty({ default: 1 })
	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	page: number = 1;

	@IsNumber()
	@Type(() => Number)
	@IsNotEmpty()
	@ApiProperty({ default: 10 })
	limit: number = 10;
}
