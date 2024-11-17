import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { MessageResponse } from '../common/response/message.response';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { ListsPaginateResponse } from '../common/response/list.response';
import { UserElasticEntity } from './entity/user.entity';
import { UserRoleEnum } from '../common/enum/role.enum';
import { Roles } from '../common/decorator/role.docorator';
@Controller('user')
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiCreatedResponse(MessageResponse.getApiDoc())
	@Roles(UserRoleEnum.ADMIN)
	@Post()
	async createUser(@Body() createUserDto: CreateUserDto): Promise<MessageResponse> {
		await this.userService.createUser(createUserDto);

		return new MessageResponse('با موفقیت ساخته شد');
	}

	@ApiOkResponse()
	@Get()
	async getAllUsers(
		@Query() query: GetAllUserDto,
	): Promise<ListsPaginateResponse<UserElasticEntity>> {
		const result = await this.userService.getAllUsers(query);
		return new ListsPaginateResponse(result.data, result.total, query.page, query.limit);
	}
}
