import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseElasticEntity } from '../../common/base/base.entity';
import { FileTypeEnum } from '../enum/file.enum';

export class FileElasticEntity extends BaseElasticEntity {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	size: number;

	@IsString()
	@IsEnum(FileTypeEnum)
	type: string;
	url: string;

	@IsDateString()
	deletedAt: Date;
}
