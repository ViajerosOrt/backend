import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Context() context,
    @Args('userReceiverId', { type: () => String }) userReceiverId: string,
    @Args('travelId', { type: () => String }) travelId: string,
    
  ): Promise<Review> {
    return this.reviewService.create(createReviewInput, context.req.user.id, userReceiverId, travelId);
  }

  @Query(() => [Review], { name: 'review' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reviewService.findOne(id);
  }

  

  @Mutation(() => Review)
  removeReview(@Args('id', { type: () => String }) id: string) {
    return this.reviewService.remove(id);

  }

  @Query(() => [Review])
  async getReviews() {
    return this.reviewService.findAll();
  }

  @Query(() => Review)
  async getReview(@Args('id') id: string): Promise<Review> {
    return this.reviewService.findOne(id);
  }
}
