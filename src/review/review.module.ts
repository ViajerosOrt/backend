import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { TravelModule } from '../travel/travel.module';

@Module({ 
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, TravelModule],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
