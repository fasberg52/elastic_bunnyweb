import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
	@ApiProperty()
	token: string;

	@ApiProperty()
	user: any;
}
