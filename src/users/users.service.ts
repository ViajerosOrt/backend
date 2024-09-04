import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Activite } from 'src/activites/activites.entity';
import { ActivitesService } from 'src/activites/activites.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activiteService: ActivitesService,
  ) {}

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

    const activites =
      await this.activiteService.findActivitesByAllId(activitesId);

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
      relations: ['userActivites']
    });
  }

  async getActivites(userId: number): Promise<Activite[]> {
    const usuario = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userActivites'],
    });

    
    return usuario.userActivites;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
