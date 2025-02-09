import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Review)
@UseGuards(JwtAuthGuard)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) { }

  @Mutation(() => Review)
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Context() context,
    @Args('userReceiverId', { type: () => String }) userReceiverId: string,
    @Args('travelId', { type: () => String }) travelId: string,

  ): Promise<Review> {
    return await this.reviewService.create(createReviewInput, context.req.user.userId, userReceiverId, travelId);
  }

  @Query(() => [Review], { name: 'reviews' })
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Query(() => Review, { name: 'review' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.reviewService.findOne(id);
  }



  @Mutation(() => String)
  async removeReview(@Args('id', { type: () => String }) id: string):Promise<any> {
    await this.reviewService.remove(id);
    return 'review successfully deleted';
  }

  @Query(() => [Review])
  async getReviews() {
    return this.reviewService.findAll();
  }

  @Query(() => Review)
  async getReview(@Args('id') id: string): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Mutation(() => Review)
  async updateReview(
    @Args('id') id: string,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    @Context() context
  ): Promise<Review> {
    return this.reviewService.update(id, updateReviewInput, context.req.user.userId);
  }
}
