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
import { ChecklistService } from '../checklist/checklist.service';
import { GraphQLError } from 'graphql';
import { Review } from '../review/entities/review.entity';

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
    private checklistService: ChecklistService,
  ) {}

  async create(
    createTravelInput: CreateTravelInput,
    activityId: string[],
    createLocationInput: CreateLocationInput,
    userId: string,
    items: string[],
  ): Promise<Travel> {
    
    const travel = this.travelRepository.create(createTravelInput);
    const user = await this.userService.createToTravel(travel, userId);

    const uniqueActivityIds = [...new Set(activityId)];
    const activities = await this.activityService.findActivitiesById(uniqueActivityIds);

    if (!user) {
      throw new GraphQLError('This user does not exist');
    }

    const today = new Date();
    const startDate = new Date(travel.startDate);
    const endDate = new Date(travel.finishDate);

    if (startDate < today) {
      throw new GraphQLError('The start date must be set in the future.');
    }

    if (endDate < startDate) {
      throw new GraphQLError(
        'The end date must be set in the future of the start date.',
      );
    }

    const location =
      await this.locationService.assignLocation(createLocationInput);

    travel.travelLocation = location;
    travel.creatorUser = user;
    travel.usersTravelers = travel.usersTravelers || [];
    travel.travelActivities = travel.travelActivities || [];
    travel.travelActivities.push(...activities);
    travel.usersTravelers.push(user);

    const saveTravel = await this.travelRepository.save(travel);

    if(items.length !== 0){
      return await this.addChecklistToTravel(saveTravel.id, user.id, items);
    }
    
    return saveTravel;
  }

  async joinToTravel(userId: string, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('There is no such trip');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new GraphQLError('This user does not exist');
    }

    if (travel.usersTravelers.length == travel.maxCap) {
      throw new GraphQLError('The trip is already full');
    }

    const isJoined = travel.usersTravelers.some(
      (traveler) => traveler.id === userId,
    );

    if (isJoined) throw new GraphQLError('You already belong to the travel');

    travel.usersTravelers.push(user);
    user.joinsTravels.push(travel);

    return this.travelRepository.save(travel);
  }

  async leaveTravel(userId: string, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);

    if (!travel) {
      throw new GraphQLError('There is no such trip');
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new GraphQLError('This user does not exist');
    }

    const isJoined = travel.usersTravelers.some(
      (traveler) => traveler.id === userId,
    );
    if (!isJoined) {
      throw new GraphQLError('The user is not attached to this trip');
    }

    if (travel.creatorUser.id === userId) {
      throw new GraphQLError('The creator of the trip cannot leave it');
    }

    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== userId,
    );

    await this.userService.leaveTravel(travel, user);
    return this.travelRepository.save(travel);
  }

  async addChecklistToTravel(
    travelId: string,
    userId: string,
    items: string[],
  ): Promise<Travel> {
    const travel = await this.findOne(travelId);

    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }

    if (travel.creatorUser.id != userId) {
      throw new GraphQLError('Only the trip creator can add a checklist');
    }

    if (travel.checklist != null) {
      throw new GraphQLError('This trip already has a checklist');
    }

    if (!items || items.length === 0) {
      throw new GraphQLError('the cheklist must have items');
    }

    travel.checklist = await this.checklistService.createChecklist(
      travel,
      items,
    );

    return this.travelRepository.save(travel);
  }

  async addItemToChecklist(
    travelId: string,
    userId: string,
    items: string[],
  ): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    if (travel.creatorUser.id != userId) {
      throw new GraphQLError('Only the creator can add items');
    }

    travel.checklist = await this.checklistService.addItems(
      travel.checklist.id,
      items,
    );

    return this.travelRepository.save(travel);
  }

  async removeItemToChecklist(
    travelId: string,
    userId: string,
    itemsId: string[],
  ): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    if (travel.creatorUser.id != userId) {
      throw new GraphQLError('Only the trip creator can add a checklist');
    }

    travel.checklist = await this.checklistService.removeItems(
      travel.checklist.id,
      itemsId,
    );

    return this.travelRepository.save(travel);
  }

  async assignItemToUser(
    travelId: string,
    userId: string,
    itemId: string,
  ): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }

    this.checklistService.assingItemToUser(travel.checklist.id, userId, itemId);
    return travel;
  }

  async assignReview(review: Review, travelId: string):Promise<Travel>{
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    travel.reviews = travel.reviews || []
    travel.reviews.push(review);
    return this.travelRepository.save(travel)
  }

  async findAll(userId?: string): Promise<Travel[]> {
    const travels = await this.travelRepository.find({
      relations: [
        'usersTravelers',
        'creatorUser',
        'travelActivities',
        'checklist',
        'checklist.items',
        'checklist.items.user',
        'travelLocation',
        'reviews',
        'reviews.createdUserBy'
      ],
    });

    return travels;

  }

  async findOne(id: string, userId?: string):Promise<Travel> {
    const travel = await this.travelRepository.findOne({
      where: {
        id,
      },
      relations: [
        'usersTravelers',
        'creatorUser',
        'travelActivities',
        'checklist',
        'checklist.items',
        'checklist.items.user',
        'travelLocation',
        'reviews'
      ],
    });

    if (!travel) {
      throw new GraphQLError('this travel not exist');

    }
    return travel;
  }

  async findAllTravelByUser(userId: string): Promise<Travel[]> {
    const travels = await this.travelRepository.find({
      where: {
        usersTravelers: {
          id: userId,
        },
      },
      relations: [
        'usersTravelers',
        'creatorUser',
        'travelActivities',
        'checklist',
        'travelLocation',
      ],
    });
    return travels
  }

  async update(id: string, updateTravelInput: UpdateTravelInput, activityId: string[], userId: string): Promise<Travel> {
    
    const travel = await this.findOne(id);

    
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    
    if (travel.creatorUser.id !== userId) {
      throw new GraphQLError('The creator of the trip cannot update');
    }

    const uniqueActivityIds = [...new Set(activityId)];
    const activities = await this.activityService.findActivitiesById(uniqueActivityIds);

    if(travel.usersTravelers.length >= updateTravelInput.maxCap){
      throw new GraphQLError('There are already more travelers joined than the amount you want to add');
    }

    const today = new Date();
    const newStartDate = new Date(updateTravelInput.startDate);
    const newEndDate = new Date(updateTravelInput.finishDate);

    if (newStartDate < today) {
      throw new GraphQLError('The start date must be set in the future.');
    }

    if (newEndDate < newStartDate) {
      throw new GraphQLError(
        'The end date must be set in the future of the start date.',
      );
    }

    Object.assign(travel, updateTravelInput);

    travel.travelActivities = activities;

    return this.travelRepository.save(travel);
  }

  remove(id: string) {
    return `This action removes a #${id} travel`;
  }

  async save(travel: Travel):Promise<void>{
    this.travelRepository.save(travel);
  }
}
