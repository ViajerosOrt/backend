import { Mutation, Resolver, Args, Int } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { Activity } from './activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ActivityResolver {
    constructor(private activityService: ActivityService) { }

    @Query((returns) => [Activity])
    activities() {
        return this.activityService.findAll();
    }

    @Query((returns) => Activity)
    activity(@Args('id', { type: () => Int }) id: number) {
        return this.activityService.findActivityById(id);
    }

    @Mutation((returns) => Activity)
    createActivity(@Args('activityInp') activityInp: CreateActivityInput) {
        return this.activityService.createActivity(activityInp);
    }
}