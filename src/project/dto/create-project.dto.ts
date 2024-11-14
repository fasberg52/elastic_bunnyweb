import { PickType } from '@nestjs/swagger';
import { ProjectElasticEntity } from '../entity/project.entity';

export class CreateProjectDto extends PickType(ProjectElasticEntity, [
	'title',
	'description',
	'thumbnail',
	'images',
	'tags',
	'categories',
	'startDate',
	'endDate',
	'status',
	'isActive',
]) {}
