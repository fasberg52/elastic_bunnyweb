import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';
import { MessageResponse } from '../common/response/message.response';

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@ApiCreatedResponse({ description: 'Create a new project' })
	@Post()
	async createProject(@Body() createProjectDto: CreateProjectDto): Promise<MessageResponse> {
		await this.projectService.createProject(createProjectDto);
		return new MessageResponse('پروژه جدید با موفقیت ایجاد شد');
	}
}
