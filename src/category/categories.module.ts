import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PaginationService } from '../utils/pagination.service';
import { CategoriesController } from './categories.controller';

@Module({
	imports: [],
	providers: [CategoriesService, PaginationService],
	controllers: [CategoriesController],
})
export class CategoriesModule {}
