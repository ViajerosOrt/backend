import { Injectable, Module } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { LocationService } from '../location/location.service';
import { CreateLocationInput } from '../location/dto/create-location.input';
import { ActivityService } from '../activity/activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Travel])],
  providers: [TravelService],
  exports: [TravelService],
})

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    private userService: UsersService,
    private activityService: ActivityService,
    private locationService: LocationService,
  ) { }

  async create(
    createTravelInput: CreateTravelInput,
    activityId: string[],
    createLocationInput: CreateLocationInput,
  ): Promise<Travel> {
    const travel = this.travelRepository.create(createTravelInput);
    const user = await this.userService.joinToTravel(
      travel,
      travel.creatorUserId,
    );
    const activities =
      await this.activityService.findActivitiesById(activityId);

    if (!user) {
      throw new Error('This user does not exist');
    }

    const today = new Date();
    const startDate = new Date(travel.startDate);
    const endDate = new Date(travel.finishDate);

    if (startDate < today) {
      throw new Error('The start date must be set in the future.');
    }

    if (endDate < startDate) {
      throw new Error(
        'The end date must be set in the future of the start date.',
      );
    }

    const location =
      await this.locationService.assignLocation(createLocationInput);

    travel.travelLocation.id = location.id;
    travel.travelLocation = location;
    travel.creatorUser = user;
    travel.usersTravelers = travel.usersTravelers || [];
    travel.travelActivities = travel.travelActivities || [];

    travel.travelActivities.push(...activities);
    travel.usersTravelers.push(user);

    return this.travelRepository.save(travel);
  }

  async joinToTravel(userId: string, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new Error('There is no such trip');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('This user does not exist');
    }

    if (travel.usersTravelers.length == travel.maxCap) {
      throw new Error('The trip is already full');
    }

    travel.usersTravelers.push(user);
    user.joinsTravels.push(travel);

    return this.travelRepository.save(travel);
  }

  async leaveTravel(userId: string, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);

    if (!travel) {
      throw new Error('There is no such trip');
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('This user does not exist');
    }

    const isJoined = travel.usersTravelers.some(
      (traveler) => traveler.id === userId,
    );
    if (!isJoined) {
      throw new Error('The user is not attached to this trip');
    }

    if (travel.creatorUserId === userId) {
      throw new Error('The creator of the trip cannot leave it');
    }

    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== userId,
    );

    await this.userService.leaveTravel(travel, user);
    return this.travelRepository.save(travel);
  }

  async findAll() {
    return await this.travelRepository.find();
  }

  async findOne(id: string): Promise<Travel> {
    return await this.travelRepository.findOne({
      where: {
        id,
      },
      relations: ['usersTravelers', 'creatorUser', 'travelActivities'],
    });
  }


  async findAllTravelByUser(userId: string): Promise<Travel[]> {
      return await this.travelRepository.find({
        where: {
          usersTravelers: {
            id: userId
          }
        }
      }
    )
  }

  update(id: string, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
  }
}
