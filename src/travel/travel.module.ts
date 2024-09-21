import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { UsersModule } from 'src/users/users.module';
import { LocationModule } from 'src/location/location.module';
import { ActivityModule } from 'src/activity/activity.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Travel]),
    UsersModule,
    ActivityModule,
    LocationModule, 
  ],
  providers: [TravelResolver, TravelService],
  exports: [TravelService],
})
export class TravelModule {}
