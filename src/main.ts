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

  /**
   * Enable shutdown hooks
   *
   * NOTE:
   *  enableShutdownHooks consumes memory by starting listeners.
   *  In cases where you are running multiple Nest apps in a single Node process (e.g., when running parallel tests with Jest),
   *  Node may complain about excessive listener processes.
   *  For this reason, enableShutdownHooks is not enabled by default.
   *  Be aware of this condition when you are running multiple instances in a single Node process.
   *
   *                                                                                quoted from NestJS Docs
   */
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
