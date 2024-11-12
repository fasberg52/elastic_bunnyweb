import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigModule } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { SearchModule } from '../elasticsearch/elasticsearch.module';
import { PaginationService } from '../utils/pagination.service';

dotenvConfig({ path: '.env' });

@Module({
	imports: [],
	controllers: [ContentController],
	providers: [ContentService, PaginationService],
	exports: [PaginationService],
})
export class ContentModule {}
