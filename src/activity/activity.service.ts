import { Injectable } from '@nestjs/common';
import { Activity } from './activity.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateActivityInput } from './dto/create-activity.input';

@Injectable()
export class ActivityService {

    constructor(
        @InjectRepository(Activity)
        private activityRepository: Repository<Activity>,
    ) { }

    async findAll(): Promise<Activity[]> {
        return this.activityRepository.find();
    }

    async findActivityById(id: string): Promise<Activity> {
        return this.activityRepository.findOne({
            where: {
                id,
            }
        });
    }

    async findActivitiesById(ids: String[]): Promise<Activity[]> {
        return await this.activityRepository.find({
            where: {
                id: In(ids), //Busca muchas id y devuelve un conjunto
            }
        })
    }

    createActivity(activity: CreateActivityInput): Promise<Activity> {
        const newAct = this.activityRepository.create(activity);
        return this.activityRepository.save(newAct)
    }


}
