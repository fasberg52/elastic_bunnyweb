import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseElasticEntity } from '../common/base/base.entity';
import { ListResponse } from '../common/response/list.response';
import { FileService } from './file.service';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileElasticEntity } from './entity/file.entity';

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@ApiOkResponse({ type: ListResponse })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<ListResponse<FileElasticEntity>> {
		const result = await this.fileService.uploadFile(file);
		return new ListResponse(result);
	}

	@ApiOkResponse()
	@Get('url/:key')
	async getFileUrl(@Param('key') key: string): Promise<ListResponse<FileElasticEntity>> {
		const result = await this.fileService.getFileUrl(key);
		return new ListResponse(result);
	}
}
