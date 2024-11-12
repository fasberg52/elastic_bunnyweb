import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { SwaggerHelper } from './common/swagger/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(compression());

	new SwaggerHelper().setup(app);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
