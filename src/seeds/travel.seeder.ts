import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { Travel } from '../travel/entities/travel.entity';
import { LocationService } from '../location/location.service';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';
import { User } from '../users/entities/user.entity';
import { Activity } from '../activity/activity.entity';
import { Transport } from '../transport/entities/transport.entity';
import { TransportService } from '../transport/transport.service';
import { Chat } from '../chat/entities/chat.entity';
import { ChatService } from '../chat/chat.service';
import { Location } from '../location/entities/location.entity';



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

    
    const user = await this.userService.findByEmail('fabricioSc@example.com');

    const user2 = await this.userService.findByEmail('francoBor@example.com');
    const user3 = await this.userService.findByEmail('luciaf@example.com');


    const travels = [
      {
        travelTitle: 'Summer Beach Getaway',
        travelDescription: 'A relaxing trip to the sunny beach.',
        startDate: new Date('2025-06-15'),
        finishDate: new Date('2025-06-20'),
        maxCap: 10,
        isEndable: true,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Brazil',
        chat: await this.addChat()
      },
      {
        travelTitle: 'Mountain Adventure',
        travelDescription: 'Hiking and exploring the beautiful mountains.',
        startDate: new Date('2025-07-01'),
        finishDate: new Date('2025-07-05'),
        maxCap: 8,
        isEndable: true,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Uruguay',
        chat: await this.addChat()

      },
      {
        travelTitle: 'City Exploration',
        travelDescription: 'Discovering the hidden gems of the city.',
        startDate: new Date('2025-08-10'),
        finishDate: new Date('2025-08-15'),
        maxCap: 15,
        isEndable: true,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Argentina',
        chat: await this.addChat()
      },
      {
        travelTitle: 'Historic City Tour',
        travelDescription: 'Explore the rich history and culture of ancient landmarks.',
        startDate: new Date('2024-03-01'),
        finishDate: new Date('2024-03-05'),
        maxCap: 20,
        isEndable: false,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Italy',
        chat: await this.addChat(),
      },
      {
        travelTitle: 'Rainforest Trekking',
        travelDescription: 'Immerse yourself in the breathtaking beauty of the rainforest.',
        startDate: new Date('2024-06-15'),
        finishDate: new Date('2024-06-20'),
        maxCap: 12,
        isEndable: false,
        creatorUser: user,
        travelLocation: await this.addLocation(), 
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Peru',
        chat: await this.addChat(),
      },
      {
        travelTitle: 'Northern Lights Adventure',
        travelDescription: 'Witness the magical auroras in the clear northern skies.',
        startDate: new Date('2024-11-10'),
        finishDate: new Date('2024-11-15'),
        maxCap: 6,
        isEndable: false,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'Norway',
        chat: await this.addChat(),
      },
      {
        travelTitle: 'Safari Expedition',
        travelDescription: 'Experience the adventure of wildlife in their natural habitat.',
        startDate: new Date('2025-12-01'),
        finishDate: new Date('2025-12-10'),
        maxCap: 10,
        isEndable: true,
        creatorUser: user,
        travelLocation: await this.addLocation(),
        travelActivities: await this.addActivity(),
        usersTravelers: [],
        transport: await this.addTransport(),
        country: 'South Africa',
        chat: await this.addChat(),
      },
      
    ];

    const chats = await this.chatService.findAll()
    for (const travel of travels) {
      travel.usersTravelers = travel.usersTravelers || [];
      travel.usersTravelers.push(user);
      travel.usersTravelers.push(user2);
      travel.usersTravelers.push(user3);
      this.chatService.save(travel.chat)
    }

    const savedTravels = await this.travelRepository.save(travels);
    const allUsers: User[] = [];
    allUsers.push(user, user2, user3)

    for (const travel of savedTravels) {
      await this.addTravelToChat(chats, travel.chat.id, travel, allUsers)
    }

    user.travelsCreated = user.travelsCreated || [];
    user.travelsCreated.push(...savedTravels);
    user.joinsTravels = user.joinsTravels || [];
    user.joinsTravels.push(...savedTravels)

    user2.joinsTravels = user2.joinsTravels || [];
    user2.joinsTravels.push(...savedTravels)

    user3.joinsTravels = user3.joinsTravels || [];
    user3.joinsTravels.push(...savedTravels)

    this.userService.save(user);
    this.userService.save(user2);
    this.userService.save(user3);

  }

  async drop(): Promise<any> {
    await this.travelRepository.delete({});
  }

  async addActivity(): Promise<Activity[]> {
    const activities = await this.activityService.findAll()
    const activityTravel = [];
    const activitesFiltered = new Set<string>();

    while (activityTravel.length < 3) {
      const rActivity = activities[Math.floor(Math.random() * activities.length)];

      if (!activitesFiltered.has(rActivity.id)) {
        activityTravel.push(rActivity);
        activitesFiltered.add(rActivity.id);

      }
    }

    return activityTravel
  }

  async addTransport(): Promise<Transport> {
    const transports = await this.transportService.findAll();
    return transports[Math.floor(Math.random() * transports.length)];
  }

  async addChat(): Promise<Chat> {
    const chat = await this.chatService.create()
    return chat
  }

  async addTravelToChat(chats: Chat[], chatId: string, travel: Travel, users: User[]) {
    for (const chat of chats) {
      if (chat.id === chatId) {
        chat.travel = travel;
        chat.users = chat.users || [];
        chat.users.push(...users);
        this.chatService.save(chat);
      }
    }
  }

  async addLocation():Promise<Location>{
    const locations = await this.locationService.findAll();
    return locations[Math.floor(Math.random() * locations.length)]
  }
}
