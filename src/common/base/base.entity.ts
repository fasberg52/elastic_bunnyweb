import { IsDateString, IsOptional, IsString } from 'class-validator';

export class BaseElasticEntity {
	@IsString()
	id: string;


	@IsDateString()
	@IsOptional()
	createdAt?: Date;

	@IsDateString()
	updatedAt: Date;
}
