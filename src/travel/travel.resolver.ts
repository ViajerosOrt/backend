import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { CreateLocationInput } from 'src/location/dto/create-location.input';


@Resolver(() => Travel)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) {}

  @Mutation(() => Travel)
  createTravel(
    @Args('createTravelInput') createTravelInput: CreateTravelInput,
    @Args('activitesId', { type: () => [Number] }) activitesId: number[],
    @Args('createLocationInput') createLocationInput: CreateLocationInput
  ) {
    return this.travelService.create(createTravelInput, activitesId, createLocationInput);
  }

  @Mutation(() => Travel)
  async joinToTravel(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('travelId', { type: () => Int }) travelId: number,
  ) {
    return this.travelService.joinToTravel(userId, travelId);
  }

  @Mutation(() => Travel)
  async leaveTrabel(
    @Args('userId', {type: () => Int}) userId: number,
    @Args('travelId', { type: () => Int }) travelId: number,
  ){
    return this.travelService.leaveTravel(userId, travelId);
  }

  @Query(() => [Travel], { name: 'travels' })
  findAll() {
    return this.travelService.findAll();
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.travelService.findOne(id);
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
}
