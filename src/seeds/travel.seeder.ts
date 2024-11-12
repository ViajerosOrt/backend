import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Travel } from '../travel/entities/travel.entity';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';
import { User } from '../users/entities/user.entity';
import { use } from 'passport';
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


    const travels = [
      {
        travelTitle: 'Summer Beach Getaway',
        travelDescription: 'A relaxing trip to the sunny beach.',
        startDate: new Date('2025-06-15'),
        finishDate: new Date('2025-06-20'),
        maxCap: 10,
        isEndable: true,
        creatorUser: user,
        travelLocation: location,
        travelActivities: await this.addActivity(),
        usersTravelers: []

       

      },
      {
        travelTitle: 'Mountain Adventure',
        travelDescription: 'Hiking and exploring the beautiful mountains.',
        startDate: new Date('2025-07-01'),
        finishDate: new Date('2025-07-05'),
        maxCap: 8,
        isEndable: true,
        creatorUser: user,
        travelLocation: location,
        travelActivities: await this.addActivity(),
        usersTravelers: []

      

      },
      {
        travelTitle: 'City Exploration',
        travelDescription: 'Discovering the hidden gems of the city.',
        startDate: new Date('2025-08-10'),
        finishDate: new Date('2025-08-15'),
        maxCap: 15,
        isEndable: false,
        creatorUser: user,
        travelLocation: location,
        travelActivities: await this.addActivity(),
        usersTravelers: []
        
      },
    ];
    for(const travel of travels){
      travel.usersTravelers = travel.usersTravelers || [];
      travel.usersTravelers.push(user);
    }

    const savedTravels = await this.travelRepository.save(travels);

    user.travelsCreated = user.travelsCreated || [];
    user.travelsCreated.push(...savedTravels);
    user.joinsTravels = user.joinsTravels || [];
    user.joinsTravels.push(...savedTravels)

    this.userService.save(user);

  }

  async drop(): Promise<any> {
    await this.travelRepository.delete({});
  }

  async addActivity():Promise<Activity[]>{
    const activities = await this.activityService.findAll()
    const activityTravel = [];
    const activitesFiltered = new Set<string>();

    while (activityTravel.length < 3) {
      const rActivity = activities[Math.floor(Math.random() * activities.length)];

      if(!activitesFiltered.has(rActivity.id)){
        activityTravel.push(rActivity);
        activitesFiltered.add(rActivity.id);

      }
    }

    return activityTravel
  }

}
