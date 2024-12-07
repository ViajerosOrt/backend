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
    const userReviewed = await this.userService.findByEmail('francoBoe@example.com');
    const travels = await this.travelService.findAll();
    const travel = travels[0];

    if (!user || !travel) {
      console.error('Required User or Travel not found for seeding.');
      return;
    }

    const travelReview = this.reviewRepository.create({
      stars: '5',
      content: 'Great travel experience!',
      createdUserBy: user,
      travel: travel,
      type: 'TRAVEL',
    });

    const userReview = this.reviewRepository.create({
      stars: '5',
      content: 'very good travel companion',
      createdUserBy: user,
      receivedUserBy: userReviewed,
      travel: travel,
      type: 'USER',
    })

    travel.reviews = travel.reviews || [];
    travel.reviews.push(travelReview)
    
    userReviewed.reviewsReceived = userReviewed.reviewsReceived || []
    userReviewed.reviewsReceived.push(userReview)

    user.reviewsCreated = user.reviewsCreated || []
    user.reviewsCreated.push(travelReview)
    user.reviewsCreated.push(userReview)

    await this.travelService.save(travel)
    await this.userService.save(user)
    await this.userService.save(userReviewed)
    await this.reviewRepository.save(travelReview);
    await this.reviewRepository.save(userReview);
  }

  async drop() {
    await this.reviewRepository.delete({});
  }
}
