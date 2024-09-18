import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityResolver } from './activity.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  providers: [ActivityService, ActivityResolver],
  exports: [ActivityService],
})
export class ActivityModule { }
