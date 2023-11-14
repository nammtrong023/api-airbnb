import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Airbnb')
    .setDescription('Airbnb api by Trong Nam')
    .setVersion('v1')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Comments')
    .addTag('Bookings')
    .addTag('Locations')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.tags = [];

  SwaggerModule.setup('api', app, document);

  await app.listen(8080);

  // HOT RELOAD
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
