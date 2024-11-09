import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentRepository } from './content.repository';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

const ElasticRepository = [ContentRepository];

@Module({
	imports: [ElasticsearchModule],
	controllers: [ContentController],
	providers: [...ElasticRepository, ContentService],
	exports: [],
})
export class ContetntModule {}
