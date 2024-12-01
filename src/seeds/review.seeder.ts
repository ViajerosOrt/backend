import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review/entities/review.entity';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { UsersService } from '../users/users.service';
import { TravelService } from '../travel/travel.service';

@Injectable()
export class ReviewSeeder implements Seeder{
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private userService: UsersService,
    private travelService: TravelService,
  ) {}

  async seed() {
    const user = await this.userService.findByEmail('fabricioSc@example.com');
    const travels = await this.travelService.findAll();
    const travel = travels[0];

    if (!user || !travel) {
      console.error('Required User or Travel not found for seeding.');
      return;
    }

    const review = this.reviewRepository.create({
      stars: '5',
      content: 'Great travel experience!',
      createdUserBy: user,
      travel: travel,
    });

    travel.reviews = travel.reviews || [];
    travel.reviews.push(review)
    await this.travelService.save(travel)
    await this.reviewRepository.save(review);
  }

  async drop() {
    await this.reviewRepository.delete({});
  }
}
