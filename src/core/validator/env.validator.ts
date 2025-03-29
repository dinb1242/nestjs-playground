import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Local = 'local',
  Development = 'dev',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment | undefined;

  @IsString()
  DATABASE_TYPE: string | undefined;

  @IsString()
  DATABASE_HOST: string | undefined;

  @IsString()
  DATABASE_NAME: string | undefined;

  @IsString()
  DATABASE_USER: string | undefined;

  @IsString()
  DATABASE_PASSWORD: string | undefined;

  @IsNumberString()
  DATABASE_PORT: number | undefined;

  @IsBooleanString()
  DATABASE_SYNCHRONIZE: boolean | undefined;

  @IsString()
  JWT_SECRET: string | undefined;

  @IsString()
  COOKIE_SECRET: string | undefined;

  @IsString()
  CIPHER_IV: string | undefined;

  @IsString()
  CIPHER_SECRET: string | undefined;
}

export function validate(config: Record<string, unknown>) {
  console.log(`===> 다음 환경에서 실행 중입니다. env=${process.env.NODE_ENV}`);
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
