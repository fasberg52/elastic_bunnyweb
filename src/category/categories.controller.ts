import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.dto';
import { GetAllCategoryDto } from './dto/get-all-category.dto';
import { CategoryElasticEntity } from './entity/category.entity';
import { ListResponse, ListsPaginateResponse } from '../common/response/list.response';
import { MessageResponse } from '../common/response/message.response';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@ApiCreatedResponse({ description: 'Create a new category' })
	@Post()
	async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<MessageResponse> {
		await this.categoriesService.createCategory(createCategoryDto);
		return new MessageResponse('دسته بندی جدید با موفقیت ایجاد شد');
	}

	@ApiOkResponse({ description: 'Update a category' })
	@Put(':id')
	async updateCategory(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	): Promise<MessageResponse> {
		await this.categoriesService.update(id, updateCategoryDto);
		return new MessageResponse('دسته بندی جدید با موفقیت ویرایش شد');
	}

	@ApiOkResponse({ description: 'Get all categories' })
	@Get()
	async getAllCategories(
		@Query() query: GetAllCategoryDto,
	): Promise<ListsPaginateResponse<CategoryElasticEntity>> {
		const result = await this.categoriesService.getAllCategories(query);
		return new ListsPaginateResponse(result.data, result.total, query.page, query.limit);
	}

	@ApiOkResponse({ description: 'Get a category by ID' })
	@Get(':id')
	async getCategoryById(@Param('id') id: string): Promise<ListResponse<CategoryElasticEntity>> {
		const result = await this.categoriesService.findOne(id);
		return new ListResponse(result);
	}

	@ApiOkResponse({ description: 'Delete a category by ID' })
	@Delete(':id')
	async deleteCategory(@Param('id') id: string): Promise<MessageResponse> {
		await this.categoriesService.deleteCategory(id);
		return new MessageResponse('Category deleted successfully');
	}
}
