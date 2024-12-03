import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PaginationService } from '../utils/pagination.service';
import { ProjectController } from './project.contoller';

@Module({
	imports: [],
	controllers: [ProjectController],
	providers: [ProjectService, PaginationService],
	exports: [ProjectService],
})
export class ProjectModule {}
