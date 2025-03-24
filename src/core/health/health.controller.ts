import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health - 서버 상태 체크')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @ApiOperation({
    summary: '서버 상태 체크',
  })
  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.http.pingCheck('server', 'http://localhost:3000'),
      () => this.memory.checkHeap('memory-heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory-rss', 150 * 1024 * 1024),
    ]);
  }
}
