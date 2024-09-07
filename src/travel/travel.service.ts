import { Injectable } from '@nestjs/common';
import { CreateTravelInput } from './dto/create-travel.input';
import { UpdateTravelInput } from './dto/update-travel.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from './entities/travel.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ActivitesService } from 'src/activites/activites.service';

@Injectable()
export class TravelService {

  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    private userService: UsersService,
    private activiteService: ActivitesService,
  ){}

  async create(createTravelInput: CreateTravelInput, activitesId : number[]):Promise<Travel> {

    const trav =  this.travelRepository.create(createTravelInput);
    const user =  await this.userService.joinToTrabel(trav, trav.creatorUserId)
    const activites = await this.activiteService.findActivitesByAllId(activitesId);

    if (!user) {
      throw new Error("No existe ese ususrio");
    }

    trav.creatorUser = user;    
    trav.usersTravelers = trav.usersTravelers || [];
    trav.travelActivitis = trav.travelActivitis || [];
    
    trav.travelActivitis.push(...activites);

    trav.usersTravelers.push(user);


    
    
    return this.travelRepository.save(trav);
  }

  async joinToTravel(userId: number, travelId: number):Promise<Travel>{

    const trav = await this.findOne(travelId)
    if(!trav){
      throw new Error("No existe ese viaje");
    }
    const user = await this.userService.findOne(userId)
    if (!user) {
      throw new Error("No existe ese ususrio");
    }

    if(trav.usersTravelers.length == trav.max_cap){
      throw new Error("El viaje ya esta lleno");
    }

    trav.usersTravelers.push(user);
    user.joinsTravels.push(trav);

    return this.travelRepository.save(trav);


  }

  findAll() {
    return this.travelRepository.find();
  }

  async findOne(id: number) {
    return await this.travelRepository.findOne({
      where:{
        id
      },
      relations: ['usersTravelers', 'creatorUser', 'travelActivitis']
    });
  }

  update(id: number, updateTravelInput: UpdateTravelInput) {
    return `This action updates a #${id} travel`;
  }

  remove(id: number) {
    return `This action removes a #${id} travel`;
  }
}
