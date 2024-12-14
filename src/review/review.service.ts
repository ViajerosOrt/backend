import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TravelService } from '../travel/travel.service';
import { GraphQLError } from 'graphql';



@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private userService: UsersService,
    private travelService: TravelService,
  ) { }


  async create(createReviewInput: CreateReviewInput, userCreatorId: string, userReceiverId: string, travelId: string): Promise<Review> {
    const review = this.reviewRepository.create(createReviewInput);

    review.createdUserBy = await this.userService.assignReview(review, userCreatorId);

    if (userReceiverId && travelId) {
      review.travel = await this.travelService.assignReview(review, travelId, userCreatorId, userReceiverId);
      review.receivedUserBy = await this.userService.receiveReview(review, userReceiverId);
      review.type = 'USER';
    }

    if (!userReceiverId) {
      review.travel = await this.travelService.assignReview(review, travelId);
      review.type = 'TRAVEL';
    }

    return this.reviewRepository.save(review)
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['createdUserBy', 'receivedUserBy', 'travel'] });
  }


  async findOne(id: string): Promise<Review | undefined> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['createdUserBy', 'receivedUserBy', 'travel'],
    });
  }

  async update(idReview: string, updateReviewInput: UpdateReviewInput, userId: string): Promise<Review> {
    const review = await this.findOne(idReview);

    if (review.createdUserBy.id !== userId) {
      throw new GraphQLError('The creator of the review cannot update');
    }

    Object.assign(review, updateReviewInput)
    return this.reviewRepository.save(review)

  }

  async remove(id: string): Promise<void> {
    await this.reviewRepository.delete(id);
  }


}
