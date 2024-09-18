import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

import { LocationService } from 'src/location/location.service';
import { CreateLocationInput } from 'src/location/dto/create-location.input';

import { ActivityService } from 'src/activity/activity.service';


@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    private userService: UsersService,
    private activityService: ActivityService, 
    private locationService: LocationService,
  ) {}

  async create(
    createTravelInput: CreateTravelInput,
    activityId: number[],
    createLocationInput: CreateLocationInput,
  ): Promise<Travel> {
    const trav = this.travelRepository.create(createTravelInput);
    const user = await this.userService.joinToTrabel(trav, trav.creatorUserId);
    const activities = await this.activityService.findActivitiesById(activityId);



    if (!user) {
      throw new Error("This user does not exist");

    }

    const today = new Date();

    const startDate = new Date(trav.startDate);
    const endDate = new Date(trav.finishDate);


    if (startDate < today) {
      throw new Error("The start date must be set in the future.");
    }


    if (endDate < startDate) {
      throw new Error("The end date must be set in the future of the start date.");
    }


    const location =
      await this.locationService.assignLocation(createLocationInput);

    trav.locationId = location.id;
    trav.travelLocation = location;
    trav.creatorUser = user;
    trav.usersTravelers = trav.usersTravelers || [];
    trav.travelActivities = trav.travelActivities || [];

    trav.travelActivities.push(...activities);

    trav.usersTravelers.push(user);




    return this.travelRepository.save(trav);
  }

  async joinToTravel(userId: number, travelId: number): Promise<Travel> {
    const trav = await this.findOne(travelId);
    if (!trav) {
      throw new Error('No existe ese viaje');

    }
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('No existe ese ususrio');
    }

    if (trav.usersTravelers.length == trav.max_cap) {
      throw new Error('El viaje ya esta lleno');

    }

    trav.usersTravelers.push(user);
    user.joinsTravels.push(trav);

    return this.travelRepository.save(trav);
  }

  async leaveTravel(userId: number, travelId: number): Promise<Travel> {
    const travel = await this.findOne(travelId);

    if (!travel) {
      throw new Error('El viaje no existe');
    }

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new Error('El ususario no existe');
    }

    const isJoined = travel.usersTravelers.some(
      (traveler) => traveler.id === userId,
    );
    if (!isJoined) {
      throw new Error('El usuario no está unido a este viaje');
    }

    if (travel.creatorUserId === userId) {
      throw new Error('EL creador del viaje no puede salir del mismo');
    }

    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== userId,
    );


    await this.userService.leaveTravel(travel, user);
    return this.travelRepository.save(travel);
  }

  findAll() {
    return this.travelRepository.find();
  }

  async findOne(id: number) {
    return await this.travelRepository.findOne({
      where: {
        id,
      },
      relations: ['usersTravelers', 'creatorUser', 'travelActivitis'],

    });
  }

  update(id: number, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
  }
}
