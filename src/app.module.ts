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
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { MyConfigModule } from './config/modules.config';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './exception/global-catch.exception';

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
		AuthModule,
	],
	providers: [
		IndexMigrationService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
	exports: [IndexMigrationService, ElasticsearchModule],
})
export class AppModule {}
