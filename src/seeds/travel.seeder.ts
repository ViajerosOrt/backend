import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Travel } from '../travel/entities/travel.entity';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class TravelSeeder implements Seeder {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    private readonly locationService: LocationService,
    private readonly userService: UsersService,
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
        trabelLocation: location.id,
      },
      {
        travelTitle: 'Mountain Adventure',
        travelDescription: 'Hiking and exploring the beautiful mountains.',
        startDate: new Date('2025-07-01'),
        finishDate: new Date('2025-07-05'),
        maxCap: 8,
        isEndable: true,
        creatorUser: user,
        trabelLocation: location.id,
      },
      {
        travelTitle: 'City Exploration',
        travelDescription: 'Discovering the hidden gems of the city.',
        startDate: new Date('2025-08-10'),
        finishDate: new Date('2025-08-15'),
        maxCap: 15,
        isEndable: false,
        creatorUser: user,
        trabelLocation: location.id,
      },
    ];
    await this.travelRepository.save(travels);
  }

  async drop(): Promise<any> {
    await this.travelRepository.delete({});
  }

}
