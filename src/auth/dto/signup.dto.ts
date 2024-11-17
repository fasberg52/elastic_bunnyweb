import { OmitType } from '@nestjs/swagger';
import { UserElasticEntity } from '../../user/entity/user.entity';

export class SignupDto extends OmitType(UserElasticEntity, [
	'id',
	'createdAt',
	'updatedAt',
	'role',
] as const) {}
