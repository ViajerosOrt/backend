import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';

@Module({
  providers: [TravelResolver, TravelService],
})
export class TravelModule {}
