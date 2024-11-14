import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { BaseElasticEntity } from '../../common/base/base.entity';
import { UserRoleEnum } from '../../common/enum/role.enum';
import { IsUserName } from '../../exception/validtor-userName.exception';
import { ApiProperty } from '@nestjs/swagger';

export class UserElasticEntity extends BaseElasticEntity {
	@ApiProperty()
	@IsString()
	@Matches(/^[\u0600-\u06FF\s]+$/, { message: 'لطفا نام فارسی وارد کنید' })
	@IsNotEmpty()
	firstName: string;

	@ApiProperty()
	@IsString()
	@Matches(/^[\u0600-\u06FF\s]+$/, { message: 'لطفا نام خانوادگی فارسی وارد کنید' })
	@IsNotEmpty()
	lastName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@IsUserName()
	userName: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@IsInt({ each: true })
	@IsEnum(UserRoleEnum, { each: true })
	role: UserRoleEnum[];
}
