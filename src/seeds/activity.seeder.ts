import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Injectable()
export class ActivitySeeder implements Seeder {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async seed(): Promise<any> {
    const activities = [
      {
        activityName: 'Walking',
      },
      {
        activityName: 'Dancing',
      },
      {
        activityName: 'Running',
      },
      {
        activityName: 'Swimming',
      },
      {
        activityName: 'Training',
      },
      {
        activityName: 'Hiking',
      },
      {
        activityName: 'Athletics',
      },
      {
        activityName: 'Pilates',
      },
      {
        activityName: 'Climbing',
      },
      {
        activityName: 'Skating',
      },
      {
        activityName: 'Cycling',
      },
      {
        activityName: 'Boxing',
      },
      {
        activityName: 'Fencing',
      },
      {
        activityName: 'Gymnastics',
      },
      {
        activityName: 'Canoeing',
      },
    ];

    await this.activityRepository.save(activities);
  }

  async drop(): Promise<any> {
    await this.activityRepository.delete({});
  }
}
