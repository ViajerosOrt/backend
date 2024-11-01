import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { CreateLocationInput } from '../location/dto/create-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Item } from '../item/entities/item.entity';



@Resolver(() => Travel)
@UseGuards(JwtAuthGuard)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) { }

  @Mutation(() => Travel)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Args('activityId', { type: () => [String] }) activityId: string[],
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @Args('items', { type: () => [String] }) items: string[],
    @Context() context,
  ) {
    return this.travelService.create(createTravelInput, activityId, createLocationInput, context.req.user.userId, items);


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

  @Mutation(() => Travel, { name: 'addChecklistToTravel' })
  async addChecklistToTravel(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    return await this.travelService.addChecklistToTravel(id, context.req.user.userId, items);
  }

  @Mutation(() => Travel, { name: 'addItemsToChecklist' })
  async addItemsToChecklist(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    return await this.travelService.addItemToChecklist(id, context.req.user.userId, items);
  }

  @Mutation(() => Travel, { name: 'removeItemsToChecklist' })
  async removeItemsToChecklist(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    return await this.travelService.removeItemToChecklist(id, context.req.user.userId, items);
  }
  @Mutation(() => Travel, { name: 'assignItemToUser' })
  async assignItemToUser(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('itemId', { type: () => String }) itemId: string,
  ) {
    return await this.travelService.assignItemToUser(id, context.req.user.userId, itemId);
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
  removeTravel(@Args('id', { type: () => String }) id: string) {
    return this.travelService.remove(id);
  }

  @Query(() => [Travel], { name: 'findAllTravelByUser' })
  findAllTravelByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.travelService.findAllTravelByUser(userId);
  }
}
