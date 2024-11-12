import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';
import { MessageResponse } from '../common/response/message.response';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ListsPaginateResponse } from '../common/response/list.response';
import { QueryDto } from '../common/dto/query.dto';
import { ContentElasticEntity } from './entity/content.entity';

@Controller('content')
export class ContentController {
	constructor(private readonly contentService: ContentService) {}

	@Get('all')
	async getAll(@Query() queryDto: QueryDto): Promise<ListsPaginateResponse<ContentElasticEntity>> {
		const result = await this.contentService.getAllContent(queryDto);
		return new ListsPaginateResponse(result.data, result.total, queryDto.page, queryDto.limit);
	}

	@Get()
	async search(@Query() searchContentDto: SearchContentDto): Promise<ListsPaginateResponse<any>> {
		const result = await this.contentService.searchContent(searchContentDto);
		return new ListsPaginateResponse(
			result.data,
			result.total,
			searchContentDto.page,
			searchContentDto.limit,
		);
	}

	@ApiCreatedResponse(MessageResponse.getApiDoc())
	@Post()
	async create(@Body() createContentDto: CreateContentDto): Promise<MessageResponse> {
		await this.contentService.createContent(createContentDto);
		return new MessageResponse('با موفقیت ساخته شد');
	}
}
