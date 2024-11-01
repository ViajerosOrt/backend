import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Travel } from '../travel/entities/travel.entity';
import { ActivityService } from '../activity/activity.service';
import { SignupUserInput } from '../auth/dto/signup-user.input';
import { GraphQLError } from 'graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activityService: ActivityService,
  ) { }

  create(createUserInput: SignupUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async addActivity(userId: string, activityId: String[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['userActivities'],
    });

    if (!user) {
      throw new GraphQLError('The user does not exist');
    }

    const activities =
      await this.activityService.findActivitiesById(activityId);

    if (activities == null) {
      throw new GraphQLError('The activities does not exist');
    }

    user.userActivities.push(...activities);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['userActivities', 'reviewsCreated', 'reviewsReceived']
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['travelsCreated', 'joinsTravels', 'userActivities']
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['travelsCreated', 'joinsTravels', 'userActivities']
    });
  }

  async joinToTravel(travel: Travel, userId: string): Promise<User> {

    const user = await this.findById(userId);

    user.joinsTravels = user.joinsTravels || [];

    if (user.id == travel.creatorUser.id) {
      user.travelsCreated = user.travelsCreated || [];
      user.travelsCreated.push(travel);
    }
    user.joinsTravels.push(travel);
    return this.userRepository.save(user);
  }

  async leaveTravel(travel: Travel, user: User) {

    user.joinsTravels = user.joinsTravels.filter(travel => travel.id !== travel.id);
    this.userRepository.save(user);

  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`There is no user with that ID: ${id}`);
    }

    Object.assign(user, updateUserInput);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.clear();
  }

}
