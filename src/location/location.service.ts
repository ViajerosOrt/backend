import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async createLocation(createLocationInput: CreateLocationInput): Promise<Location> {
    const newLocation = this.locationRepository.create(createLocationInput);
    return this.locationRepository.save(newLocation);
  }

  async assignLocation(
    createLocationInput: CreateLocationInput,
  ): Promise<Location> {
    const location = await this.findLocationByLog(
      createLocationInput.longLatPoint,
    );

    if (!location) {
      return await this.createLocation(createLocationInput);
    }
    return location;

  } 

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  findOne(id: string) {
    return this.locationRepository.findOne({
      where: { id },
    });
  }

  async findLocationByLog(logLat: string): Promise<Location> {
    return this.locationRepository.findOne({
      where: { longLatPoint: logLat },
    });
  }

}
