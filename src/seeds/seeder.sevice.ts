import { Injectable } from '@nestjs/common';
import { ActivitySeeder } from './activity.seeder';
import { LocationSeeder } from './location.seeder';
import { UserSeeder } from './user.seeder';
import { TravelSeeder } from './travel.seeder';

@Injectable()
export class Seeder {
    
  constructor(
    private readonly activitySeeder: ActivitySeeder,
    private readonly locationSeeder: LocationSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly travelSeeder: TravelSeeder
  ) {}

  async seed(): Promise<any> {
    await this.userSeeder.seed();
    await this.activitySeeder.seed();
    await this.locationSeeder.seed();
    await this.travelSeeder.seed();

    console.log('Seeding completed for all entities!');
  }

  async drop(): Promise<any> {
    await this.userSeeder.drop();
    await this.activitySeeder.drop();
    await this.locationSeeder.drop();
    await this.travelSeeder.drop();
  }
}
