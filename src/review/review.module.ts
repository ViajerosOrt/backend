import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TravelModule } from 'src/travel/travel.module';

@Module({ 
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, TravelModule],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
