import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ListResponse } from '../common/response/list.response';
import { Public } from '../common/decorator/public.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { SignupDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOkResponse({ type: ListResponse })
	@Public()
	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<ListResponse<any>> {
		const result = await this.authService.login(loginDto);
		return new ListResponse(result);
	}

	@Public()
	@Post('register')
	async register(@Body() signupDto: SignupDto): Promise<ListResponse<any>> {
		const result = await this.authService.register(signupDto);
		return new ListResponse(result);
	}
}
