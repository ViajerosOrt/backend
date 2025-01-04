import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Travel } from '../travel/entities/travel.entity';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';
import { User } from '../users/entities/user.entity';
import { use } from 'passport';
import { Activity } from '../activity/activity.entity';
import { Transport } from '../transport/entities/transport.entity';
import { TransportService } from '../transport/transport.service';
import { Chat } from '../chat/entities/chat.entity';
import { ChatService } from '../chat/chat.service';



@Injectable()
export class TravelSeeder implements Seeder {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    private readonly locationService: LocationService,
    private readonly userService: UsersService,
    private readonly activityService: ActivityService,
    private readonly transportService: TransportService,
    private readonly chatService: ChatService
  ) {}

  async seed(): Promise<any> {

    const location =
      await this.locationService.findLocationByLog('-31.4827, -57.9119');
    
    const user = await this.userService.findByEmail('fabricio@example.com');

    const users =  await this.userService.findAll()

    const locations = await this.locationService.findAll();
    const chats = await this.chatService.findAll()

    const travelNames1 = ["Mountain Adventure", "Ocean Escape", "Cultural Journey", "Safari Expedition", "Island Retreat"];
    const travelNames2 = ["City Break", "Historical Tour", "Desert Trek", "Wildlife Discovery", "Road Trip"];
    const descriptions = [
      "Experience breathtaking views and adventure.",
      "Discover hidden gems and local culture.",
      "Relax and unwind in serene surroundings.",
      "Embark on a journey filled with excitement."
    ];


    

    for(let i =0; i< travelNames1.length; i++){
      let month = i+1;
      let locationTravel = locations[Math.floor(Math.random() * locations.length)];
      let userCreator = users[Math.floor(Math.random() * users.length)]

      const actualTravel =       {
        travelTitle: travelNames1[i],
        travelDescription: descriptions[Math.floor(Math.random() * descriptions.length)],
        startDate: new Date('2025-'+'0'+month+'-2'),
        finishDate: new Date('2025-'+'0'+month+'-20'),
        maxCap: 10,
        isEndable: true,
        creatorUser: userCreator,
        travelLocation: locationTravel,
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Uruguay',
        countryOfOrigin: 'Uruguay' ,
        chat: await this.addChat()
      }

      
      actualTravel.usersTravelers = actualTravel.usersTravelers || [];
      actualTravel.usersTravelers.push(userCreator);
      this.chatService.save(actualTravel.chat)
      const savedTravelactual = await this.travelRepository.save(actualTravel);

      await this.addTravelToChat(chats, savedTravelactual.chat.id, savedTravelactual, userCreator)

      userCreator.travelsCreated = userCreator.travelsCreated || [];
      userCreator.travelsCreated.push(savedTravelactual);
      userCreator.joinsTravels = userCreator.joinsTravels || [];
      userCreator.joinsTravels.push(savedTravelactual)
  
      this.userService.save(userCreator);

    }

    
    for(let i =0; i< travelNames2.length; i++){
      let month = i+1;
      let locationTravel = locations[Math.floor(Math.random() * locations.length)];
      let userCreator = users[Math.floor(Math.random() * users.length)]

      const endTravel =       {
        travelTitle: travelNames2[i],
        travelDescription: descriptions[Math.floor(Math.random() * descriptions.length)],
        startDate: new Date('2024-'+'0'+month+'-2'),
        finishDate: new Date('2024-'+'0'+month+'-20'),
        maxCap: 10,
        isEndable: false,
        creatorUser: userCreator,
        travelLocation: locationTravel,
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Uruguay',
        countryOfOrigin: 'Uruguay' ,
        chat: await this.addChat()
      }

      endTravel.usersTravelers = endTravel.usersTravelers || [];
      endTravel.usersTravelers.push(userCreator);
      this.chatService.save(endTravel.chat)
      const savedTravelEnd = await this.travelRepository.save(endTravel);

      await this.addTravelToChat(chats, savedTravelEnd.chat.id, savedTravelEnd, userCreator)

      userCreator.travelsCreated = userCreator.travelsCreated || [];
      userCreator.travelsCreated.push(savedTravelEnd);
      userCreator.joinsTravels = userCreator.joinsTravels || [];
      userCreator.joinsTravels.push(savedTravelEnd)

      this.userService.save(userCreator);

    }

  }

  async drop(): Promise<any> {
    await this.travelRepository.delete({});
  }

  async addActivity():Promise<Activity[]>{
    const activities = await this.activityService.findAll()
    const activityTravel = [];
    const activitesFiltered = new Set<string>();

    while (activityTravel.length < 3) {
      const rActivity = activities[Math.floor(Math.random() * activities.length)];

      if(!activitesFiltered.has(rActivity.id)){
        activityTravel.push(rActivity);
        activitesFiltered.add(rActivity.id);

      }
    }

    return activityTravel
  }

  async addTransport():Promise<Transport>{
    const transports =  await this.transportService.findAll();
    return transports[Math.floor(Math.random() * transports.length)];
  }

  async addChat():Promise<Chat>{
    const chat =  await this.chatService.create()
    return chat
  }

  async addTravelToChat(chats: Chat[] ,chatId: string, travel: Travel, user: User){
    for(const chat of chats){
      if(chat.id === chatId){
        chat.travel = travel;
        chat.users = chat.users || [];
        chat.users.push(user);
        this.chatService.save(chat);
      }
    }
  }
}
