import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Swagger Initialize */
  const config = new DocumentBuilder()
    .setTitle('Playground')
    .setDescription('NestJS Playground')
    .setVersion('1.0')
    .addTag('playground')
    .setContact('정지현', 'https://velog.io/@dinb1242', 'dinb1242@naver.com')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
