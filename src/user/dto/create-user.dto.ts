import { PickType } from '@nestjs/swagger';
import { UserElasticEntity } from '../../user/entity/user.entity';

export class CreateUserDto extends PickType(UserElasticEntity, [
	'id',
	'firstName',
	'lastName',
	'userName',
	'password',
	'role',
	'createdAt',
	'updatedAt',
]) {}
