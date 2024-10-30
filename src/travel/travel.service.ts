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
import { Item } from 'src/item/entities/item.entity';
import { ChecklistService } from '../checklist/checklist.service';

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
  ) { }

  async create(
    createTravelInput: CreateTravelInput,
    activityId: string[],
    createLocationInput: CreateLocationInput,
    userId: string,
    items: string[]
  ): Promise<Travel> {
    const travel = this.travelRepository.create(createTravelInput);
    const user = await this.userService.createToTravel(
      travel,
      userId,
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

    if (travel.creatorUser.id === userId) {
      throw new Error('The creator of the trip cannot leave it');
    }

    travel.usersTravelers = travel.usersTravelers.filter(
      (traveler) => traveler.id !== userId,
    );

    await this.userService.leaveTravel(travel, user);
    return this.travelRepository.save(travel);
  }

  async addChecklistToTravel(travelId: string, userId: string, items: string[]):Promise<Travel>{
    const travel = await this.findOne(travelId)

    if(!travel){
      throw new Error('this travel not exist');
    }

    if(travel.creatorUser.id != userId){
      throw new Error('Only the trip creator can add a checklist');
    }
    
    if(travel.checklist != null){
      throw new Error('This trip already has a checklist');
    }

    if(!items || items.length === 0){
      throw new Error('the cheklist must have items');
    }

    
    travel.checklist = await this.checklistService.createChecklist(travel, items);

    return this.travelRepository.save(travel);
  }

  async addItemToChecklist(travelId: string, userId: string, items: string[]):Promise<Travel>{
    const travel = await this.findOne(travelId);
    if(!travel){
      throw new Error('this travel not exist');
    }
    if(travel.creatorUser.id != userId){
      throw new Error('Only the creator can add items');
    }

    travel.checklist = await this.checklistService.addItems(travel.checklist.id, items);

    return this.travelRepository.save(travel);

  }

  async removeItemToChecklist(travelId: string, userId: string, itemsId: string[]):Promise<Travel>{
    const travel = await this.findOne(travelId);
    if(!travel){
      throw new Error('this travel not exist');
    }
    if(travel.creatorUser.id != userId){
      throw new Error('Only the trip creator can add a checklist');
    }

    travel.checklist = await this.checklistService.removeItems(travel.checklist.id, itemsId)

    return this.travelRepository.save(travel)

  }

  async assignItemToUser(travelId: string, userId: string, itemId: string):Promise<Travel>{
    const travel = await this.findOne(travelId);
    if(!travel){
      throw new Error('this travel not exist');
    }

    this.checklistService.assingItemToUser(travel.checklist.id,userId,itemId)
    console.log(travel.checklist)
    return travel;
  }

  async findAll() {
    const travel = await this.travelRepository.find({
      relations: ['usersTravelers', 'creatorUser', 'travelActivities', 'checklist','checklist.items', 'checklist.items.user', 'travelLocation'],
    });

    return travel
  }

  async findOne(id: string): Promise<Travel> {
    return await this.travelRepository.findOne({
      where: {
        id,
      },
      relations: ['usersTravelers', 'creatorUser', 'travelActivities', 'checklist','checklist.items','checklist.items.user', 'travelLocation'],
    });
  }

  async bringTotalTravelers(id: string): Promise<number> {
    const travel = await this.travelRepository.findOne({
      where: {
        id,
      },
      relations: ['usersTravelers'],
    });
    if(!travel){
      throw new Error('this travel not exist');
    }
    return travel ? travel.usersTravelers.length : 0;
  }


  async findAllTravelByUser(userId: string): Promise<Travel[]> {
      return await this.travelRepository.find({
        where: {
          usersTravelers: {
            id: userId
          }
        },
        relations: ['usersTravelers', 'creatorUser', 'travelActivities', 'checklist', 'travelLocation'],
      }
    )
  }

  update(id: string, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: string) {
    return `This action removes a #${id} travel`;
  }
}
