import { ExtractJwt, StrategyOptions, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'secretKey',
		} as StrategyOptions);
	}

	async validate(payload: any) {
		await this.authService.validateUser(payload);
		return { userId: payload.sub, username: payload.username };
	}
}
