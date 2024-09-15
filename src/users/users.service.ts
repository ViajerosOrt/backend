import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Travel } from 'src/travel/entities/travel.entity';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activityService: ActivityService,
  ) { }

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async addActivity(userId: number, activityId: number[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userActivities'],
    });

    if (!user) {
      throw new Error("No existe ese usuario");
    }

    const activities =
      await this.activityService.findActivitiesById(activityId);

    if (activities == null) {
      throw new Error("No existe esa actividad");
    }

    user.userActivities.push(...activities);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['userActivities']
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['travelsCreated', 'joinsTravels', 'userActivities']
    });
  }

  async joinToTrabel(trvel: Travel, userId: number): Promise<User> {

    const user = await this.findOne(userId);

    user.joinsTravels = user.joinsTravels || [];

    if (user.id == trvel.creatorUserId) {
      user.travelsCreated = user.travelsCreated || [];
      user.travelsCreated.push(trvel);
    }
    user.joinsTravels.push(trvel);
    return this.userRepository.save(user);
  }

  async leaveTravel(travel: Travel, user: User) {

    user.joinsTravels = user.joinsTravels.filter(travel => travel.id !== travel.id);
    this.userRepository.save(user);

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
