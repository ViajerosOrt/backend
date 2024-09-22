import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Location)
@UseGuards(JwtAuthGuard)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) { }

  @Mutation(() => Location)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationService.create(createLocationInput);
  }

  @Query(() => [Location], { name: 'location' })
  findAll() {
    return this.locationService.findAll();
  }

  @Query(() => Location, { name: 'location' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.locationService.findOne(id);
  }

  @Mutation(() => Location)
  updateLocation(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationService.update(updateLocationInput.id, updateLocationInput);
  }

  @Mutation(() => Location)
  removeLocation(@Args('id', { type: () => Int }) id: number) {
    return this.locationService.remove(id);
  }
}
