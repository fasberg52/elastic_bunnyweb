import { UnauthorizedException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { INestApplication } from '@nestjs/common';

export class SwaggerHelper {
	private basePath = process.env.SWAGGER_PATH;
	private username = process.env.SWAGGER_USERNAME;
	private password = process.env.SWAGGER_PASSWORD;
	private title = process.env.SWAGGER_TITLE;
	private description = process.env.SWAGGER_DESCRIPTION;

	setup(app: INestApplication) {
		if (!this.basePath || !this.username || !this.password) {
			console.error('Swagger Disabled : configuration missing ...');
			return;
		}
		const config = new DocumentBuilder()
			.setTitle(this.title)
			.setDescription(this.description)
			.setVersion('1.0.0')
			.addBearerAuth()
			.addGlobalParameters({
				name: 'Accept-Language',
				in: 'header',
				schema: {
					enum: ['en', 'fa'],
				},
			})
			.build();
		const expressApp = app.getHttpAdapter().getInstance();
		expressApp.use((request: Request, response: Response, next: NextFunction) =>
			this.basicAuthInterceptor(request, response, next),
		);
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup(this.basePath, app, document, {
			swaggerOptions: {
				persistAuthorization: true,
				tagsSorter: 'alpha',
				filter: true,
				operationsSorter: 'alpha',
			},
		});
	}

	getBasePath() {
		return this.basePath.startsWith('/') ? this.basePath : `/${this.basePath}`;
	}

	setError(response: Response, next: NextFunction) {
		response.header('WWW-Authenticate', 'Basic realm="Paraf" charset="UTF-8"');
		next(new UnauthorizedException());
	}

	basicAuthInterceptor(request: Request, response: Response, next: NextFunction) {
		const url = request.url.split('?').shift().replace(/\/+$/, '');
		if (url !== this.getBasePath() && url !== this.getBasePath() + '-json') {
			next();
			return;
		}
		let credentials = request.headers['authorization'];
		if (typeof credentials !== 'string') {
			this.setError(response, next);
			return;
		}
		credentials = credentials.replace('Basic ', '');
		const credentialsDecoded = Buffer.from(credentials, 'base64').toString('utf-8');
		const userPassRE = /^([^:]*):(.*)$/;
		const userPass = userPassRE.exec(credentialsDecoded);
		if (userPass[1] === this.username && userPass[2] === this.password) {
			next();
			return;
		}
		this.setError(response, next);
	}
}
