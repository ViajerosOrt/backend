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
  ) {}


  async create(createReviewInput: CreateReviewInput, userCreatorId: string,userReceiverId: string, travelId: string ): Promise<Review> {
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

    const review = await this.reviewRepository.create(createReviewInput);
    review.createdUserBy = await this.userService.assignReview(review,userCreatorId);
    review.receivedUserBy = await this.userService.receiveReview(review, userReceiverId);
    review.travel = await this.travelService.assignReview(review, travelId);
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
