import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelResolver } from './travel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Travel]), UsersModule],
  providers: [TravelResolver, TravelService],
})
export class TravelModule {}
