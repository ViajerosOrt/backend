import { Injectable } from '@nestjs/common';
import { ActivitySeeder } from './activity.seeder';
import { LocationSeeder } from './location.seeder';
import { UserSeeder } from './user.seeder';
import { TravelSeeder } from './travel.seeder';
import { ChecklistSeeder } from './checklist.seeder';
import { ReviewSeeder } from './review.seeder';
import { TransportSeeder } from './transport.seeder';


@Injectable()
export class Seeder {
    
  constructor(
    private readonly activitySeeder: ActivitySeeder,
    private readonly transportSeeder: TransportSeeder,
    private readonly locationSeeder: LocationSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly travelSeeder: TravelSeeder,
    private readonly checklistSeeder: ChecklistSeeder,
    private readonly reviewSeeder: ReviewSeeder

  ) {}

  async seed(): Promise<any> {
    await this.activitySeeder.seed();
    await this.transportSeeder.seed();
    await this.userSeeder.seed();
    await this.locationSeeder.seed();
    await this.travelSeeder.seed();
    await this.checklistSeeder.seed();
    await this.reviewSeeder.seed();



    console.log('Seeding completed for all entities!');
  }

  async drop(): Promise<any> {
    await this.activitySeeder.drop();
    await this.transportSeeder.drop();
    await this.userSeeder.drop();
    await this.locationSeeder.drop();
    await this.travelSeeder.drop();
    await this.checklistSeeder.drop();
    await this.reviewSeeder.drop();
  }
}
