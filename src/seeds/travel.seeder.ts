import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Travel } from '../travel/entities/travel.entity';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';
import { TravelService } from 'src/travel/travel.service';
import { ActivityService } from 'src/activity/activity.service';
import { Activity } from 'src/activity/activity.entity';

@Injectable()
export class TravelSeeder implements Seeder {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    private readonly locationService: LocationService,
    private readonly userService: UsersService,
    private readonly activityService: ActivityService,
  ) {}

  async seed(): Promise<any> {
    const location =
      await this.locationService.findLocationByLog('-31.4827, -57.9119');
    const user = await this.userService.findByEmail('fabricioSc@example.com');
    const activities = await this.activityService.findAll();
    const activitiesTravel = [];

    for(let i = 0; i < 3; i++){
      activitiesTravel.push(activities[Math.floor(Math.random() * activities.length)])
    }
    const travels = [
      {
        travelTitle: 'Summer Beach Getaway',
        travelDescription: 'A relaxing trip to the sunny beach.',
        startDate: new Date('2025-06-15'),
        finishDate: new Date('2025-06-20'),
        maxCap: 10,
        isEndable: true,
        creatorUserId: user.id,
        trabelLocation: location.id,
        travelActivities: activitiesTravel,
      },
      {
        travelTitle: 'Mountain Adventure',
        travelDescription: 'Hiking and exploring the beautiful mountains.',
        startDate: new Date('2025-07-01'),
        finishDate: new Date('2025-07-05'),
        maxCap: 8,
        isEndable: true,
        creatorUserId: user.id,
        trabelLocation: location.id,
        travelActivities: activitiesTravel,
      },
      {
        travelTitle: 'City Exploration',
        travelDescription: 'Discovering the hidden gems of the city.',
        startDate: new Date('2025-08-10'),
        finishDate: new Date('2025-08-15'),
        maxCap: 15,
        isEndable: false,
        creatorUserId: user.id,
        trabelLocation: location.id,
        travelActivities: activitiesTravel,
      },
    ];
    await this.travelRepository.save(travels);
  }

  async drop(): Promise<any> {
    await this.travelRepository.delete({});
  }

}
