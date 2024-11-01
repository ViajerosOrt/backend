import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TravelService } from '../travel/travel.service';
import { error } from 'console';
import { GraphQLError } from 'graphql';

@Injectable()
export class ReviewService {

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private userService: UsersService,
    private travelService: TravelService,
  ) {}

  async create(createReviewInput: CreateReviewInput): Promise<Review> {
    const { userCreatorId, userReceiverId, travelId, stars, content } = createReviewInput;

    const createdBy = await this.userService.findById(userCreatorId);
    const receivedBy = await this.userService.findById(userReceiverId);
    const travel = await this.travelService.findOne(travelId);

    if(!createdBy){
      throw new GraphQLError('User created by not found');
    }
    if(!receivedBy){
      throw new GraphQLError('User received by not found');
    }
    if (!travel) {
      throw new GraphQLError('Travel not found');
    }

    const review = this.reviewRepository.create({
      stars: stars.toString(),
      content,
    });

    review.createdUserBy = createdBy;
    review.receivedUserBy = receivedBy;
    review.travel = travel;
  
    return this.reviewRepository.save(review);
  }
  
  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['createdBy', 'receivedBy'] });
  }
  
  async findOne(id: string): Promise<Review | undefined> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['createdBy', 'receivedBy'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.reviewRepository.delete(id);
  }


}
