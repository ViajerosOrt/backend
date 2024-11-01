import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ActivityService } from '../activity/activity.service';
import { Activity } from '../activity/activity.entity';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly activityService: ActivityService,
  ) {}

  async seed(): Promise<any> {

    const users = [
      {
        name: 'Fabricio Scarone',
        email: 'fabricioSc@example.com',
        password: await bcrypt.hash('password123', 10),
        birthDate: new Date('2002-01-01'),
        description: 'First user for seeder',
        userActivities: await this.addActivity(),
      },
      {
        name: 'Franco Borreli',
        email: 'francoBoe@example.com',
        password: await bcrypt.hash('password456', 10),
        birthDate: new Date('2002-05-10'),
        description: 'Second user for seeder',
        userActivities: await this.addActivity(),
      },
      {
        name: 'Bruno Lapaz',
        email: 'brunoLa@example.com',
        password: await bcrypt.hash('password789', 10),
        birthDate: new Date('2001-11-20'),
        description: 'Third user for seeder',
        userActivities: await this.addActivity(),
      },
    ];  
    
    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    await this.userRepository.delete({});
  }

  async addActivity():Promise<Activity[]>{
    const activitys = await this.activityService.findAll()
    const activityTravel = [];
    for(let i= 0; i < 3; i++ ){
      activityTravel.push(activitys[Math.floor(Math.random() * activitys.length)])
    }
    return activityTravel
  }
  
}
