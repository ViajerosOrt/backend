import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistService } from './checklist.service';
import { Checklist } from './entities/checklist.entity';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';

@Resolver(() => Checklist)
export class ChecklistResolver {
  constructor(private readonly checklistService: ChecklistService) {}

  @Mutation(() => Checklist)
  createChecklist(@Args('createChecklistInput') createChecklistInput: CreateChecklistInput) {
    return this.checklistService.create(createChecklistInput);
  }

  @Query(() => [Checklist], { name: 'checklist' })
  findAll() {
    return this.checklistService.findAll();
  }

  @Query(() => Checklist, { name: 'checklist' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.checklistService.findOne(id);
  }

  @Mutation(() => Checklist)
  updateChecklist(@Args('updateChecklistInput') updateChecklistInput: UpdateChecklistInput) {
    return this.checklistService.update(updateChecklistInput.id, updateChecklistInput);
  }

  @Mutation(() => Checklist)
  removeChecklist(@Args('id', { type: () => Int }) id: number) {
    return this.checklistService.remove(id);
  }
}
