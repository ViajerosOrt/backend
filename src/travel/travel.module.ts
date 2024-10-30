import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { ReviewModule } from '../review/review.module';
import { UsersModule } from '../users/users.module';
import { LocationModule } from '../location/location.module';
import { ActivityModule } from '../activity/activity.module';
import { ChecklistModule } from '../checklist/checklist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Travel]),
    UsersModule,
    ActivityModule,
    LocationModule, 
    ChecklistModule,
  ],
  providers: [TravelResolver, TravelService],
  exports: [TravelService],
})
export class TravelModule {}
