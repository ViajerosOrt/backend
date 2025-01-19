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
    const userReviewed = await this.userService.findByEmail('francoBor@example.com');
    const userReviewed2 = await this.userService.findByEmail('luciaf@example.com');
    
    const travels = await this.travelService.findAll();
    const travelsEnd = travels.filter(trav => trav.isEndable === false);
    const travel = travelsEnd[0];
    const travelReview = this.reviewRepository.create({
      stars: '5',
      content: 'Great travel experience!',
      createdUserBy: user,
      travel: travel,
      type: 'TRAVEL',
    });

    const travelReview2 = this.reviewRepository.create({
      stars: '4',
      content: 'Beautiful scenery, but the trip was a bit rushed.',
      createdUserBy: userReviewed,
      travel: travel,
      type: 'TRAVEL',
    });

    const userReview = this.reviewRepository.create({
      stars: '5',
      content: 'very good travel companion',
      createdUserBy: user,
      receivedUserBy: userReviewed,
      type: 'USER',
    })

    const userReview2 = this.reviewRepository.create({
      stars: '4',
      content: 'Good travel companion, but a bit quiet at times.',
      createdUserBy: userReviewed2,
      receivedUserBy: userReviewed,
      type: 'USER',
    });
    
    const travelReviewSave1 = await this.reviewRepository.save(travelReview);
    const travelReviewSave2 = await this.reviewRepository.save(travelReview2);
    const userReviewSave1 = await this.reviewRepository.save(userReview);
    const userReviewSave2 = await this.reviewRepository.save(userReview2);

    travel.reviews = travel.reviews || [];
    travel.reviews.push(travelReviewSave1)
    travel.reviews.push(travelReviewSave2)

    user.reviewsCreated = user.reviewsCreated || []
    user.reviewsCreated.push(travelReviewSave1)
    user.reviewsCreated.push(userReviewSave1)

    userReviewed2.reviewsCreated = userReviewed2.reviewsCreated || []
    userReviewed2.reviewsCreated.push(travelReviewSave2)
    userReviewed2.reviewsCreated.push(userReviewSave2)
    
    userReviewed.reviewsReceived = userReviewed.reviewsReceived || []
    userReviewed.reviewsReceived.push(userReviewSave1)
    userReviewed.reviewsReceived.push(userReviewSave2)
    

    await this.travelService.save(travel)
    await this.userService.save(user)
    await this.userService.save(userReviewed)
    await this.userService.save(userReviewed2)
  }

  async drop() {
    await this.reviewRepository.delete({});
  }
}
