import { Module } from '@nestjs/common';

import { CountryModule } from './country/country.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule, CountryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
