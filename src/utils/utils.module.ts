import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule],
	controllers: [],
	providers: [PaginationService,S3Service],
	exports: [PaginationService,S3Service],
})
export class UtilsModule {}
