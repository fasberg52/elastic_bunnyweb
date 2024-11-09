import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';

@Controller('content')
export class ContentController {
	constructor(private readonly contentService: ContentService) {}

	@Get()
	async search(@Query() searchContentDto: SearchContentDto) {
		return this.contentService.searchContent(searchContentDto);
	}

	@Post()
	async create(@Body() createContentDto: CreateContentDto) {
		return this.contentService.createContent(createContentDto);
	}
}
