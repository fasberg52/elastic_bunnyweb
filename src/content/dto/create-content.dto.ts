import { ContentElasticEntity } from '../entity/content.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateContentDto extends PickType(ContentElasticEntity, [
	'title',
	'content',
	'thumbnail',
	'images',
	'tags',
	'categories',
] as const) {}
