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

  async create(createLocationInput: CreateLocationInput): Promise<Location> {
    const newloc = this.locationRepository.create(createLocationInput);
    return this.locationRepository.save(newloc);
  }

  async assignLocation(createLocationInput: CreateLocationInput):Promise<Location>{
      const location = this.findOneLocationByLog(createLocationInput.long_lat_point)

    if(!location){
      return this.create(createLocationInput);
    }

    return location;
  }

  async findAll():Promise<Location[]> {
    return this.locationRepository.find();
  }

  findOne(id: number) {
    return this.locationRepository.findOne({
      where:{id}
    });
  }

  async findOneLocationByLog(logLat: string):Promise<Location>{
    return this.locationRepository.findOne({
      where: {long_lat_point : logLat}
    })
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
