import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export class ContentRepository implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    protected readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    await this.createMapping();
  }

  async createMapping() {
    await this.elasticsearchService.indices.create({
      index: await this.getIndex(),
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            content: { type: 'text' },
            thumbnail: { type: 'text' },
            images: {
              type: 'nested',
              properties: { url: { type: 'text' }, alt: { type: 'text' } },
            },
            tags: { type: 'keyword' },
            category: { type: 'keyword' },
            createdAt: { type: 'date' },
            updatedAt: { type: 'date' },
          },
        },
      },
    });
  }

  async getIndex() {
    return this.configService.get('ELASTICSEARCH_INDEX');
  }
}
