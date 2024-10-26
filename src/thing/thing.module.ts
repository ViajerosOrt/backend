import { Module } from '@nestjs/common';
import { ThingService } from './thing.service';
import { ThingResolver } from './thing.resolver';

@Module({
  providers: [ThingResolver, ThingService],
})
export class ThingModule {}
