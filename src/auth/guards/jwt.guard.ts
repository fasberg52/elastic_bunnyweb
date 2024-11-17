import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector,
	) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
		if (isPublic) {
			return true;
		}

		const request = await context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		console.log('token', token);
		if (!token) {
			throw new UnauthorizedException('توکن پیدا نشد');
		}

		try {
			console.log('request >>> ', JSON.stringify(request.user));

			const payload = await this.jwtService.verifyAsync(token);
			console.log('Decoded payload:', payload);
			if (!payload?.sub || !payload?.username) {
				throw new Error('Invalid payload structure');
			}
			request.user = { id: payload.sub, username: payload.username };
		} catch (error) {
			console.error('JWT Verification Error:', error.message);

			throw new UnauthorizedException('توکن معتبر نیست');
		}

		return true;
	}

	private extractTokenFromHeader(request: any): string | null {
		const authHeader = request.headers.authorization;
		if (!authHeader) {
			return null;
		}

		const [type, token] = authHeader.split(' ');
		return type === 'Bearer' ? token : null;
	}
}
