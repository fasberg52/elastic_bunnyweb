import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { S3Service } from '../utils/s3.service';

@Module({
	imports: [ConfigModule.forRoot()],
	providers: [FileService,S3Service],
	controllers: [FileController],
	exports: [FileService],
})
export class FileModule {}
