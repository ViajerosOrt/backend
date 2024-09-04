import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';

@Resolver(() => Travel)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) {}

  @Mutation(() => Travel)
  createTravel(@Args('createTravelInput') createTravelInput: CreateTravelInput) {
    return this.travelService.create(createTravelInput);
  }

  @Query(() => [Travel], { name: 'travel' })
  findAll() {
    return this.travelService.findAll();
  }

  @Query(() => Travel, { name: 'travel' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.travelService.findOne(id);
  }

  @Mutation(() => Travel)
  updateTravel(@Args('updateTravelInput') updateTravelInput: UpdateTravelInput) {
    return this.travelService.update(updateTravelInput.id, updateTravelInput);
  }

  @Mutation(() => Travel)
  removeTravel(@Args('id', { type: () => Int }) id: number) {
    return this.travelService.remove(id);
  }
}
