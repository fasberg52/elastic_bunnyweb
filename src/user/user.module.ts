import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PaginationService } from '../utils/pagination.service';

@Module({
	imports: [],
	controllers: [UserController],
	providers: [UserService, PaginationService],
	exports: [],
})
export class UserModule {}
