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
    const nombres = [
      'Fabricio',
      'Franco',
      'Bruno',
      "Sofía",
      "Mateo",
      "Valentina",
      "Lucas",
      "Camila",
      "Julián",
      "Isabella",
      "Diego",
      "Martina",
      "Sebastián",
      "Emily",
      "Daniel",
      "Mía",
      "Gabriel",
      "Paula",
      "Javier",
      "Natalia",
    ];

    const paises = [
      "Uruguay",
      "Argentina",
      "Brasil",
      "España",
      "Canadá",
      "Japón",
      "Australia"
    ];
    
    for(let i =0; i < nombres.length; i++){
      let user = {
        name: nombres[i],
        email: nombres[i].toLocaleLowerCase()+'@example.com',
        password: await bcrypt.hash('password'+ i, 10),
        birthDate: await this.generarFechaAleatoriaMayorDe18(),
        description: 'User number ' + i + ' for seeder',
        userActivities: await this.addActivity(),
        instagram: 'ig'+ nombres[i],
        whatsapp: '+59897418914',
        country: paises[Math.floor(Math.random() * paises.length)],
        travelsCreated: [],
      }

      await this.userRepository.save(user);
    }

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

  async generarFechaAleatoriaMayorDe18(): Promise<Date> {
    const fechaActual = new Date();
    const anioMaximo = fechaActual.getFullYear() - 18; 
    const anioMinimo = anioMaximo - 82; 
  
    const anioAleatorio = Math.floor(Math.random() * (anioMaximo - anioMinimo + 1)) + anioMinimo;
    const mesAleatorio = Math.floor(Math.random() * 12); 
    const diaAleatorio = Math.floor(Math.random() * 28) + 1; 
  
    return new Date(anioAleatorio, mesAleatorio, diaAleatorio);
  }
  
}

