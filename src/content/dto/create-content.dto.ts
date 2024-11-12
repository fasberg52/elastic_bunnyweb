import { PickType } from '@nestjs/swagger';
import { ContentElasticEntity } from '../entity/content.entity';

export class CreateContentDto extends PickType(ContentElasticEntity, [
	'title',
	'content',
	'thumbnail',
	'images',
	'tags',
	'categories',
] as const) {}
