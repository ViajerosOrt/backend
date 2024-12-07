import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { CreateLocationInput } from '../location/dto/create-location.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TravelDto } from './dto/travel.dto.reolver';
import { TravelTransformer } from './travel.transformer';



@Resolver(() => Travel)
@UseGuards(JwtAuthGuard)
export class TravelResolver {
  constructor(
    private readonly travelService: TravelService,
    private readonly travelTransformer: TravelTransformer
  ) { }

  @Mutation(() => TravelDto)
  async createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Args('activityId', { type: () => [String] }) activityId: string[],
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
    @Args('items', { type: () => [String] }) items: string[],
    @Args('transportId', { type: () => String, nullable: true }) transportId: string,
    @Context() context,
  ) {
    const travel = await this.travelService.create(createTravelInput, activityId, createLocationInput, context.req.user.userId, items, transportId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto)
  async joinToTravel(
    @Args('travelId', { type: () => String }) travelId: string,
    @Context() context
  ) {
    const travel = await this.travelService.joinToTravel(context.req.user.userId, travelId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto)
  async leaveTravel(
    @Args('travelId', { type: () => String }) travelId: string,
    @Context() context
  ) {
    const travel = await this.travelService.leaveTravel(context.req.user.userId, travelId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'expelFromTravel' })
  async expelFromTravel(
    @Context() context,
    @Args('bannedUserId', { type: () => String }) bannedUserId: string,
    @Args('travelId', { type: () => String }) travelId: string,
  ) {
    const travel = await this.travelService.expelFromTravel(context.req.user.userId, bannedUserId, travelId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'addChecklistToTravel' })
  async addChecklistToTravel(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    const travel = await this.travelService.addChecklistToTravel(id, context.req.user.userId, items);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'addItemsToChecklist' })
  async addItemsToChecklist(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    const travel = await this.travelService.addItemToChecklist(id, context.req.user.userId, items);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'removeItemsToChecklist' })
  async removeItemsToChecklist(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('items', { type: () => [String] }) items: string[],
  ) {
    const travel = await this.travelService.removeItemToChecklist(id, context.req.user.userId, items);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'assignItemToUser' })
  async assignItemToUser(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
    @Args('itemId', { type: () => String }) itemId: string,
  ) {
    const travel = await this.travelService.assignItemToUser(id, context.req.user.userId, itemId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => TravelDto, { name: 'removeItemToUser' })
  async removeItemToUser(
    @Args('id', { type: () => String }) id: string,
    @Context() context,
  ) {
    const travel = await this.travelService.removeItemToUser(id, context.req.user.userId)
    return this.travelTransformer.toDto(travel)
  }

  @Query(() => [TravelDto], { name: 'travels' })
  async findAll(
    @Context() context,
    @Args('startDate', { type: () => Date, nullable: true }) startDate?: Date,
    @Args('endDate', { type: () => Date, nullable: true }) endDate?: Date,
    @Args('travelName', { type: () => String, nullable: true }) travelName?: string,
    @Args('activityIds', { type: () => [String], nullable: true }) activityIds?: string[],
    @Args('transportId', { type: () => String, nullable: true }) transportId?: string,
    @Args('countryName', { type: () => String, nullable: true }) countryName?: string,
    @Args('creatorId', { type: () => String, nullable: true }) creatorId?: string,
  ) {
    const travels = await this.travelService.findAll(startDate, endDate, travelName, activityIds, transportId, countryName, creatorId);
    return await this.travelTransformer.toDTOs(travels, context.req.user.userId);
  }



  @Query(() => TravelDto, { name: 'travel' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @Context() context) {
    const travel = await this.travelService.findOne(id, context.req.user.userId);
    return await this.travelTransformer.toDto(travel, context.req.user.userId)
  }


  @Mutation(() => TravelDto)
  async updateTravel(
    @Args('updateTravelInput') updateTravelInput: UpdateTravelInput,
    @Context() context,
    @Args('activityId', { type: () => [String] }) activityId: string[],
  ) {
    const travel = await this.travelService.update(updateTravelInput.id, updateTravelInput, activityId, context.req.user.userId);
    return this.travelTransformer.toDto(travel);
  }

  @Mutation(() => Travel)
  removeTravel(@Args('id', { type: () => String }) id: string) {
    return this.travelService.remove(id);
  }
}
