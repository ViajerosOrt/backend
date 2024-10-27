import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from 'nestjs-seeder';
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { ActivityService } from "src/activity/activity.service";

@Injectable()
export class UserSeeder implements Seeder{

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async seed(): Promise<any>{ 

    

        const users = [
            {
              name: 'Fabricio Scarone',
              email: 'fabricioSc@example.com',
              password: await bcrypt.hash('password123', 10),
              birthDate: new Date('2002-01-01'),
              description: 'First user for seeder',
            },
            {
              name: 'Franco Borreli',
              email: 'francoBoe@example.com',
              password: await bcrypt.hash('password456', 10),
              birthDate: new Date('2002-05-10'),
              description: 'Second user for seeder',
            },
            {
              name: 'Bruno Lapaz',
              email: 'brunoLa@example.com',
              password: await bcrypt.hash('password789', 10),
              birthDate: new Date('2001-11-20'),
              description: 'Third user for seeder',
            }
        ];

        await this.userRepository.save(users);
    }

    async drop(): Promise<any> {
        await this.userRepository.delete({});
      }
}