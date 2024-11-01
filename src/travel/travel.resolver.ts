import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { CreateLocationInput } from '../location/dto/create-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';



@Resolver(() => Travel)
@UseGuards(JwtAuthGuard)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) { }

  @Mutation(() => Travel)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Args('createUserId', { type: () => String }) userId: string,
    @Args('activitiesId', { type: () => [String] }) activityId: string[],
    @Args('createLocationInput') createLocationInput: CreateLocationInput
  ) {
    return this.travelService.create(createTravelInput, activityId, createLocationInput, userId);

  }

  @Mutation(() => Travel)
  async joinToTravel(
    @Args('travelId', { type: () => String }) travelId: string,
    @Context() context
  ) {
    return this.travelService.joinToTravel(context.req.user.userId, travelId);
  }

  @Mutation(() => Travel)
  async leaveTravel(
    @Args('travelId', { type: () => String }) travelId: string,
    @Context() context
  ) {
    return this.travelService.leaveTravel(context.req.user.userId, travelId);
  }

  @Query(() => [Travel], { name: 'travels' })
  async findAll(
    @Context() context
  ) {
    return await this.travelService.findAll(context.req.user.userId);
  }



  @Query(() => Travel, { name: 'travel' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @Context() context) {
    return this.travelService.findOne(id, context.req.user.userId);
  }

  @Mutation(() => Travel)
  updateTravel(
    @Args('updateTravelInput') updateTravelInput: UpdateTravelInput,
  ) {
    return this.travelService.update(updateTravelInput.id, updateTravelInput);
  }

  @Mutation(() => Travel)
  removeTravel(@Args('id', { type: () => Int }) id: number) {
    return this.travelService.remove(id);
  }

  @Query(() => [Travel], { name: 'findAllTravelByUser' })
  findAllTravelByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.travelService.findAllTravelByUser(userId);
  }
}
