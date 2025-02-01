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
        description: 'No puedo quedarme quieto, siempre estoy buscando la próxima gran aventura. Me encanta escalar montañas, explorar lugares remotos y sumergirme en culturas desconocidas. Para mí, viajar es la mejor forma de sentirme vivo.',
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
        description: 'Me fascina perderme en las calles de las ciudades, descubrir cafés escondidos y sumergirme en la historia de cada lugar. Siempre llevo mi cámara para capturar esos pequeños detalles que hacen única a cada ciudad.',
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
        description: 'Viajar y mantenerme activo van de la mano. Siempre llevo mis zapatillas de running o mi bicicleta para explorar nuevos paisajes. Ya sea nadando en un lago, escalando una montaña o corriendo por la playa, disfruto cada momento en movimiento.',
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
        description: 'Para mí, conocer un destino significa probar su comida. Me encanta descubrir mercados locales, probar platos típicos y aprender sobre la cultura a través de sus sabores. Siempre estoy en busca de la mejor comida callejera o ese restaurante escondido que solo los locales conocen',
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
        description: 'Trabajo mientras viajo y viajo mientras trabajo. Me encanta descubrir nuevos lugares donde pueda conectar con personas de todo el mundo y encontrar espacios con buen café y WiFi. Cada destino es una oportunidad para aprender y crecer.',
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
        description: 'No me gusta planear demasiado, prefiero dejar que el destino me sorprenda. Viajo ligero, con la mente abierta y con ganas de conocer personas increíbles en el camino. Creo que las mejores experiencias son las que no se planean.',
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
        description: 'Para mí, lo mejor de viajar es la gente que conoces en el camino. Me encanta escuchar historias, compartir experiencias y crear lazos con personas de diferentes culturas. Cada destino es una oportunidad para hacer nuevos amigos y ver el mundo desde otra perspectiva.',
        userActivities: await this.addActivity(),
        instagram: 'diego_mdz',
        whatsapp: '+59894567890',
        country: 'Paraguay',
      },
      {
        name: 'bot',
        email: 'bot@gpt.com',
        password: await bcrypt.hash('password0101', 10),
        birthDate: new Date('1998-08-09'),
        description: '¿Has tenido alguna vez un sueño, Neo, que parecías tan seguro de que era real? ¿Y si no pudieras despertar de ese sueño? ¿Cómo diferenciarías el mundo de los sueños del mundo real?',
        userActivities: await this.addActivity(),
        instagram: 'gpt',
        whatsapp: '+010101010101',
        country: 'Uruguay',
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

