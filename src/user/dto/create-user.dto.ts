import { OmitType, PickType } from '@nestjs/swagger';
import { UserElasticEntity } from '../../user/entity/user.entity';

export class CreateUserDto extends OmitType(UserElasticEntity, ['id', 'createdAt', 'updatedAt']) {}
