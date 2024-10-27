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
        activityName: 'Caminar',
      },
      {
        activityName: 'Bailar',
      },
      {
        activityName: 'Correr',
      },
      {
        activityName: 'Nadar',
      },
      {
        activityName: 'Entrenar',
      },
      {
        activityName: 'Senderismo',
      },
      {
        activityName: 'Atletismo',
      },
      {
        activityName: 'Pilates',
      },
      {
        activityName: 'Escalar',
      },
      {
        activityName: 'Patinar',
      },
      {
        activityName: 'Ciclismo',
      },
      {
        activityName: 'Boxeo',
      },
      {
        activityName: 'Esgrima',
      },
      {
        activityName: 'Gimnasia',
      },
      {
        activityName: 'Remo en canoa',
      },
    ];

    await this.activityRepository.save(activities);
  }

  async drop(): Promise<any> {
    await this.activityRepository.delete({});
  }
}
