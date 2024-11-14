import { PickType } from '@nestjs/swagger';
import { FileElasticEntity } from '../entity/file.entity';

export class CreateFileDto extends PickType(FileElasticEntity, [
	'id',
	'name',
	'size',
	'type',
	'url',
]) {}
