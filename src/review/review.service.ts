import { Injectable } from '@nestjs/common';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TravelService } from '../travel/travel.service';
import { error } from 'console';

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

    const createdBy = await this.userService.findOne(userCreatorId);
    const receivedBy = await this.userService.findOne(userReceiverId);
    const travel = await this.travelService.findOne(travelId);

    if(!createdBy){
      throw new Error('User created by not found');
    }
    if(!receivedBy){
      throw new Error('User received by not found');
    }
    if (!travel) {
      throw new Error('Travel not found');
    }

    const review = this.reviewRepository.create({
      stars: stars.toString(),
      content,
      createdBy,
      receivedBy,
      travel,
    });
  
    return this.reviewRepository.save(review);
  }
  
  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['createdBy', 'receivedBy'] });
  }
  
  async findOne(id: number): Promise<Review | undefined> {
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['createdBy', 'receivedBy'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }


}
