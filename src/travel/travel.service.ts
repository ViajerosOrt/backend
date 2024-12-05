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
import { TransportService } from '../transport/transport.service';

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
    private transportService: TransportService
  ) { }

  async create(
    createTravelInput: CreateTravelInput,
    activityId: string[],
    createLocationInput: CreateLocationInput,
    userId: string,
    items: string[],
    transportId: string,
  ): Promise<Travel> {

    const travel = this.travelRepository.create(createTravelInput);
    const user = await this.userService.createToTravel(travel, userId);

    const uniqueActivityIds = [...new Set(activityId)];
    const activities = await this.activityService.findActivitiesById(uniqueActivityIds);
    const transport = await this.transportService.findOne(transportId);

    if (!user) {
      throw new GraphQLError('This user does not exist');
    }

    const userViajes = user.travelsCreated.filter(trav => trav.id !== travel.id && trav.startDate <= travel.finishDate && trav.finishDate >= travel.startDate)

    if (userViajes.length > 0) {
      throw new GraphQLError('You already have an active trip on that date');
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
    travel.transport = transport;


    const saveTravel = await this.travelRepository.save(travel);

    if (items.length !== 0) {
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


    if (this.hasItem(travel.id, userId)) {
      await this.removeItemToUser(travel.id, userId);
    }
    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== userId,
    );

    await this.userService.leaveTravel(travel, user);
    return this.travelRepository.save(travel);
  }

  async expelFromTravel(createdUserId: string, bannedUserId: string, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);

    if (!travel) {
      throw new GraphQLError('There is no such trip');
    }

    const createdUser = await this.userService.findById(createdUserId);

    if (!createdUser) {
      throw new GraphQLError('This user does not exist');
    }
    const bannerUser = await this.userService.findById(bannedUserId);

    if (!bannerUser) {
      throw new GraphQLError('This user does not exist');
    }

    if (travel.creatorUser.id !== createdUser.id) {
      throw new GraphQLError('Only the creator can ban users');
    }

    if (this.hasItem(travel.id, bannerUser.id)) {
      await this.removeItemToUser(travel.id, bannerUser.id);
    }
    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== bannerUser.id,
    );

    await this.userService.leaveTravel(travel, bannerUser);
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
    return this.travelRepository.save(travel);
  }

  async removeItemToUser(travelId: string, userId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    this.checklistService.removeItemToUser(travel.checklist.id, userId);
    return this.travelRepository.save(travel);
  }

  async hasItem(travelId: string, userId: string): Promise<boolean> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    return this.checklistService.hasItem(travelId, userId)
  }

  async assignReview(review: Review, travelId: string): Promise<Travel> {
    const travel = await this.findOne(travelId);
    if (!travel) {
      throw new GraphQLError('this travel not exist');
    }
    travel.reviews = travel.reviews || []
    travel.reviews.push(review);
    return this.travelRepository.save(travel)
  }

  async findAll(startDate?: Date, endDate?: Date, travelName?: string, activityIds?: string[], transportId?: string, countryName?: string, creatorId?: string): Promise<Travel[]> {
    const query = await this.travelRepository.createQueryBuilder('travel')
    console.log(travelName)
    query
      .leftJoinAndSelect('travel.usersTravelers', 'usersTravelers')
      .leftJoinAndSelect('travel.creatorUser', 'creatorUser')
      .leftJoinAndSelect('travel.travelActivities', 'travelActivities')
      .leftJoinAndSelect('travel.checklist', 'checklist')
      .leftJoinAndSelect('checklist.items', 'items')
      .leftJoinAndSelect('items.user', 'itemUser')
      .leftJoinAndSelect('travel.travelLocation', 'travelLocation')
      .leftJoinAndSelect('travel.reviews', 'reviews')
      .leftJoinAndSelect('reviews.createdUserBy', 'createdUserBy')
      .leftJoinAndSelect('travel.transport', 'transport')

    if (activityIds && activityIds.length > 0) {
      query.andWhere('travelActivities.id In (:...activityIds)', { activityIds })
    }

    if (startDate) {
      query.andWhere('travel.startDate >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('travel.finishDate <= :endDate', { endDate })
    }

    if (travelName) {
      query.andWhere('travel.title LIKE :travelName', { travelName: `%${travelName}%` });
    }


    if (transportId) {
      query.andWhere('transport.id = :transportId', { transportId })
    }


    if (countryName) {
      query.andWhere('travel.country = :countryName', { countryName })
    }

    if (creatorId) {
      query.andWhere('creatorUser.id = :userId', { creatorId })

    }


    const travels = await query.getMany()
    return travels;

  }

  async findOne(id: string, userId?: string): Promise<Travel> {
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
        'reviews',
        'transport'
      ],
    });

    if (!travel) {
      throw new GraphQLError('this travel not exist');

    }
    return travel;
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

    if (travel.usersTravelers.length >= updateTravelInput.maxCap) {
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



  async save(travel: Travel): Promise<void> {
    this.travelRepository.save(travel);
  }
}
