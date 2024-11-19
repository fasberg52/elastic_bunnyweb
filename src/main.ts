import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { SwaggerHelper } from './common/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/global-catch.exception';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['log', 'debug', 'warn'],
	});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
	app.useGlobalInterceptors();

	app.use(compression());
	app.setGlobalPrefix('api');
	app.enableCors();
	const httpAdapter = app.get(HttpAdapterHost);
	app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
	new SwaggerHelper().setup(app);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
