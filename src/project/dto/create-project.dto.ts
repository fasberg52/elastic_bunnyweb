import { PickType } from '@nestjs/swagger';
import { ProjectEntity } from '../entity/project.entity';

export class CreateProjectDto extends PickType(ProjectEntity, [
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
