import { IsDateString, IsOptional, IsString } from 'class-validator';

export abstract class BaseElasticEntity {
	@IsString()
	id: string;


	@IsDateString()
	@IsOptional()
	createdAt?: Date;

	@IsDateString()
	updatedAt: Date;
}
