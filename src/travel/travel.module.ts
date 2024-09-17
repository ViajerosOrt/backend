import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { UsersModule } from 'src/users/users.module';
import { ActivitesModule } from 'src/activites/activites.module';
import { LocationModule } from 'src/location/location.module';

@Module({
  imports:[TypeOrmModule.forFeature([Travel]), UsersModule, ActivitesModule, LocationModule],
  providers: [TravelResolver, TravelService],
})
export class TravelModule {}
