import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => Review)
  createReview(@Args('createReviewInput') createReviewInput: CreateReviewInput): Promise<Review> {
    return this.reviewService.create(createReviewInput);
  }

  @Query(() => [Review], { name: 'review' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.findOne(id);
  }

  

  @Mutation(() => Review)
  removeReview(@Args('id', { type: () => Int }) id: number) {
    return this.reviewService.remove(id);

  }

  @Query(() => [Review])
  async getReviews() {
    return this.reviewService.findAll();
  }

  @Query(() => Review)
  async getReview(@Args('id') id: number): Promise<Review> {
    return this.reviewService.findOne(id);
  }
}
