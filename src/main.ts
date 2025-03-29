import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './core/filter/global-exception.filter';
import { LoggingInterceptor } from './core/interceptor/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  /* Swagger Initialize */
  const config = new DocumentBuilder()
    .setTitle('Playground')
    .setDescription('NestJS Playground')
    .setVersion('1.0')
    .setContact('정지현', 'https://velog.io/@dinb1242', 'dinb1242@naver.com')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     name: 'JWT',
    //     in: 'header',
    //   },
    //   'access-token',
    // )
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

  /* Add global response interceptor */
  app.useGlobalInterceptors(new ResponseInterceptor());

  /* Add global logging interceptor */
  app.useGlobalInterceptors(new LoggingInterceptor());

  /* Add global exception filter */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /* Apply class validator */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /* 쿠키 세팅 (스웨거 로그인을 위함) */
  app.use(cookieParser(process.env.COOKIE_SECRET));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
