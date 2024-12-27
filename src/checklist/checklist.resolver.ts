import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistService } from './checklist.service';
import { Checklist } from './entities/checklist.entity';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { Travel } from '../travel/entities/travel.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Resolver(() => Checklist)
@UseGuards(JwtAuthGuard)
export class ChecklistResolver {
  constructor(private readonly checklistService: ChecklistService) {}



  @Query(() => Checklist, { name: 'checklist' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.checklistService.findOne(id);
  }

}
