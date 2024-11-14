import { Module, Global } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ContentModule } from './content/content.module';
import { UtilsModule } from './utils/utils.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { CategoriesModule } from './category/categories.module';
import { FileModule } from './file-manager/file.module';
import { IndexMigrationService } from './migration/elastic.migration';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ElasticsearchModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				node: configService.get('ELASTICSEARCH_NODE'),
				auth: {
					username: configService.get('ELASTICSEARCH_USERNAME'),
					password: configService.get('ELASTICSEARCH_PASSWORD'),
				},
				cloud: null,
			}),
			inject: [ConfigService],
		}),
		ContentModule,
		UtilsModule,
		ProjectModule,
		UserModule,
		CategoriesModule,
		FileModule,
	],
	providers: [IndexMigrationService],
	exports: [ElasticsearchModule, IndexMigrationService],
})
export class AppModule {}
