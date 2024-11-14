import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { SwaggerHelper } from './common/swagger/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

	app.use(compression());
	app.setGlobalPrefix('api');
	new SwaggerHelper().setup(app);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
