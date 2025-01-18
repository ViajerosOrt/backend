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
        instagram: 'fabriscar22',
        whatsapp: '+59897418914',
        country: 'Uruguay',
      },
      {
        name: 'Franco Borreli',
        email: 'francoBor@example.com',
        password: await bcrypt.hash('password456', 10),
        birthDate: new Date('2002-05-10'),
        description: 'Second user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'francobor_',
        whatsapp: '+59896799173',
        country: 'Uruguay',
      },
      {
        name: 'Bruno Lapaz',
        email: 'brunoLa@example.com',
        password: await bcrypt.hash('password789', 10),
        birthDate: new Date('2001-11-20'),
        description: 'Third user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'brunnaries',
        whatsapp: '+59894136832',
        country: 'Uruguay',
      },
      {
        name: 'Lucía Fernández',
        email: 'luciaf@example.com',
        password: await bcrypt.hash('password321', 10),
        birthDate: new Date('1999-03-15'),
        description: 'Fourth user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'lucia_fernandez99',
        whatsapp: '+59897314123',
        country: 'Uruguay',
      },
      {
        name: 'Martín Rodríguez',
        email: 'martinr@example.com',
        password: await bcrypt.hash('password654', 10),
        birthDate: new Date('1998-07-08'),
        description: 'Fifth user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'martin_rodriguez',
        whatsapp: '+59891234567',
        country: 'Argentina',
      },
      {
        name: 'Camila Gómez',
        email: 'camilag@example.com',
        password: await bcrypt.hash('password987', 10),
        birthDate: new Date('2000-02-22'),
        description: 'Sixth user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'cami_gomez',
        whatsapp: '+59893456789',
        country: 'Chile',
      },
      {
        name: 'Diego Méndez',
        email: 'diegom@example.com',
        password: await bcrypt.hash('password111', 10),
        birthDate: new Date('1997-12-05'),
        description: 'Seventh user for seeder',
        userActivities: await this.addActivity(),
        instagram: 'diego_mdz',
        whatsapp: '+59894567890',
        country: 'Paraguay',
      },
    ];  
    
    await this.userRepository.save(users);
  }

  async drop(): Promise<any> {
    await this.userRepository.delete({});
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
  
}

