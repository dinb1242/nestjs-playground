import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './core/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './core/validator/env.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { DataSource } from 'typeorm';
import { ExampleModule } from './domain/v1/example/example.module';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate,
    }),
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      logging: true,
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    ExampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
