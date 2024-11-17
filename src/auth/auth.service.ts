import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ListResponse } from '../common/response/list.response';
import { SignupDto } from './dto/signup.dto';
import { UserRoleEnum } from '../common/enum/role.enum';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(loginDto: LoginDto): Promise<any> {
		const { username, password } = loginDto;
		const user = await this.usersService.searchByUserName(username);
		console.log(`>>> user is ${JSON.stringify(user)}`);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		if (user && (await this.usersService.comparePassword(password, user.password))) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}
	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto);
		console.log(`>>> login user is ${JSON.stringify(user)}`);

		const payload = { username: user.userName, sub: user.id };

		return { access_token: await this.jwtService.signAsync(payload) };
	}

	async register(signupDto: SignupDto) {
		const userWithDefaultRole = {
			...signupDto,
			role: [UserRoleEnum.USER],
		};
		const user = await this.usersService.createUser(userWithDefaultRole);
		const payload = { username: user.userName, sub: user._id };
		const access_token = await this.jwtService.signAsync(payload);
		return {
			access_token,
		};
	}
}
