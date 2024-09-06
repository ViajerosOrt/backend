import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Activite } from 'src/activites/activites.entity';
import { ActivitesService } from 'src/activites/activites.service';
import { Travel } from 'src/travel/entities/travel.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activiteService: ActivitesService,
  ) { }

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async agregarActividad(userId: number, activitesId: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userActivites'],
    });

    if (!user) {
      throw new Error("No existe ese usuario");
    }

    const activites =
      await this.activiteService.findActivitesByAllId(activitesId);

    if (activites == null) {
      throw new Error("No existe esa actividad");
    }

    user.userActivites.push(...activites);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['userActivites']
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['travelsCreated', 'joinsTravels', 'userActivites']
    });
  }

  async joinToTrabel(trvel: Travel, userId: number): Promise<User> {

    const user = await this.findOne(userId);
    user.joinsTravels = user.joinsTravels || [];
    user.joinsTravels.push(trvel);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`No existe un usuario con esa ID ${id}`);
    }

    Object.assign(user, updateUserInput);

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
