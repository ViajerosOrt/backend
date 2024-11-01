import { Injectable } from '@nestjs/common';
import { ActivitySeeder } from './activity.seeder';
import { LocationSeeder } from './location.seeder';
import { UserSeeder } from './user.seeder';
import { TravelSeeder } from './travel.seeder';
import { ChecklistSeeder } from './checklist.seeder';


@Injectable()
export class Seeder {
    
  constructor(
    private readonly activitySeeder: ActivitySeeder,
    private readonly locationSeeder: LocationSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly travelSeeder: TravelSeeder,
    private readonly checklistSeeder: ChecklistSeeder
  ) {}

  async seed(): Promise<any> {
    await this.activitySeeder.seed();
    console.log("a")
    await this.userSeeder.seed();
    console.log("b")
    await this.locationSeeder.seed();
    console.log("c")
    await this.travelSeeder.seed();
    console.log("d")
    await this.checklistSeeder.seed();
    console.log("e")



    console.log('Seeding completed for all entities!');
  }

  async drop(): Promise<any> {
    await this.activitySeeder.drop();
    await this.userSeeder.drop();
    await this.locationSeeder.drop();
    await this.travelSeeder.drop();
    await this.checklistSeeder.drop();

  }
}
