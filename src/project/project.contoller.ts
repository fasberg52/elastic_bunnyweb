import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { MessageResponse } from '../common/response/message.response';
import { ListsPaginateResponse } from '../common/response/list.response';
import { ProjectElasticEntity } from './entity/project.entity';
import { GetAllProjectDto, UpdateProjectDto, CreateProjectDto } from './dto/index.dto';
import { Public } from '../common/decorator/public.decorator';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@ApiCreatedResponse({ description: 'Create a new project' })
	@Post()
	async createProject(@Body() createProjectDto: CreateProjectDto): Promise<MessageResponse> {
		await this.projectService.createProject(createProjectDto);
		return new MessageResponse('پروژه جدید با موفقیت ایجاد شد');
	}

	@ApiOkResponse({ description: 'Update a project' })
	@Put(':id')
	async updateProject(
		@Param('id') id: string,
		@Body() updateProjectDto: UpdateProjectDto,
	): Promise<MessageResponse> {
		await this.projectService.updateProject(id, updateProjectDto);
		return new MessageResponse('پروژه با موفقیت به روز رسانی شد');
	}

	@Public()
	@ApiOkResponse({ description: 'get all projects' })
	@Get()
	async getAllProjects(
		@Query() query: GetAllProjectDto,
	): Promise<ListsPaginateResponse<ProjectElasticEntity>> {
		const result = await this.projectService.getAllProject(query);
		return new ListsPaginateResponse(result.data, result.total, query.page, query.limit);
	}

	@ApiOkResponse({ description: 'Soft delete a project' })
	@Delete(':id')
	async softDeleteProject(@Param('id') id: string): Promise<MessageResponse> {
		await this.projectService.deleteProject(id);
		return new MessageResponse('پروژه با موفقیت حذف شد');
	}
}
