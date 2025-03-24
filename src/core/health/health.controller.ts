import { BadRequestException, Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

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
