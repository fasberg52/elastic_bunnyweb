import { PickType } from '@nestjs/swagger';
import { CategoryElasticEntity } from '../entity/category.entity';

export class CreateCategoryDto extends PickType(CategoryElasticEntity, [
	'name',
	'description',
	'image',
	'slug',
	'parentId',
	'status',
	'level',
	'type',
] as const) {}
