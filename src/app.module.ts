import { Module } from '@nestjs/common';
import { HealthModule } from './core/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './core/validator/env.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { ExampleModule } from './domain/v1/example/example.module';
import { AuthModule } from './domain/v1/auth/auth.module';
import { UserModule } from './domain/v1/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/guard/auth.guard';
import { RolesGuard } from './shared/guard/role.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 50,
        },
      ],
    }),
    ExampleModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
