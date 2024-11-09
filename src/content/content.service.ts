import { Injectable } from '@nestjs/common';
import { ContentRepository } from './content.repository';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';

@Injectable()
export class ContentService {
	constructor(private readonly contentRepository: ContentRepository) {}
	async createContent(createContentDto: CreateContentDto) {
		return this.contentRepository.createContent(createContentDto);
	}
	async searchContent(searchContentDto: SearchContentDto) {
		return this.contentRepository.searchContent(searchContentDto);
	}
}
