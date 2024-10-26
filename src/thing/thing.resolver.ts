import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ThingService } from './thing.service';
import { Thing } from './entities/thing.entity';
import { CreateThingInput } from './dto/create-thing.input';
import { UpdateThingInput } from './dto/update-thing.input';

@Resolver(() => Thing)
export class ThingResolver {
  constructor(private readonly thingService: ThingService) {}

  @Mutation(() => Thing)
  createThing(@Args('createThingInput') createThingInput: CreateThingInput) {
    return this.thingService.create(createThingInput);
  }

  @Query(() => [Thing], { name: 'thing' })
  findAll() {
    return this.thingService.findAll();
  }

  @Query(() => Thing, { name: 'thing' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.thingService.findOne(id);
  }

  @Mutation(() => Thing)
  updateThing(@Args('updateThingInput') updateThingInput: UpdateThingInput) {
    return this.thingService.update(updateThingInput.id, updateThingInput);
  }

  @Mutation(() => Thing)
  removeThing(@Args('id', { type: () => Int }) id: number) {
    return this.thingService.remove(id);
  }
}
