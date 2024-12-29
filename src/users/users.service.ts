import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Travel } from '../travel/entities/travel.entity';
import { ActivityService } from '../activity/activity.service';
import { SignupUserInput } from '../auth/dto/signup-user.input';
import { use } from 'passport';
import { GraphQLError } from 'graphql';
import { Review } from '../review/entities/review.entity';
import { Item } from '../item/entities/item.entity';
import { CreateMessageInput } from '../message/dto/create-message.input';
import { Message } from '../message/entities/message.entity';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private activityService: ActivityService,
    private chatService: ChatService
  ) {}

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
    const query = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userActivities', 'userActivities')
      .leftJoinAndSelect('user.travelsCreated', 'travelsCreated')
      .leftJoinAndSelect('travelsCreated.usersTravelers', 'usersTravelers')
      .leftJoinAndSelect('user.joinsTravels', 'joinsTravels')
      .leftJoinAndSelect('user.reviewsCreated', 'reviewsCreated')
      .leftJoinAndSelect('user.reviewsReceived', 'reviewsReceived')
      .leftJoinAndSelect(
        'reviewsCreated.receivedUserBy',
        'receivedUserBy',
        'reviewsCreated.type = :type',
        { type: 'USER' }
      )
      .leftJoinAndSelect('reviewsCreated.travel', 'travelReviewsCreated')
      .leftJoinAndSelect('reviewsReceived.createdUserBy', 'createdUserBy')
      .leftJoinAndSelect('reviewsReceived.travel', 'travelReviewsReceived')
      .leftJoinAndSelect('user.items', 'items')
      .leftJoinAndSelect('user.chats', 'chats');
      



    const users = await query.getMany();
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'travelsCreated',
        'travelsCreated.usersTravelers',
        'travelsCreated.travelActivities',
        'joinsTravels',
        'joinsTravels.usersTravelers',
        'joinsTravels.travelActivities',
        'reviewsCreated',
        'reviewsCreated.receivedUserBy',
        'reviewsCreated.travel',
        'reviewsReceived',
        'reviewsReceived.createdUserBy',
        'userActivities',
        'items',
      ],
    });

    if (!user) {
      throw new GraphQLError(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: [
        'travelsCreated',
        'travelsCreated.usersTravelers',
        'travelsCreated.travelActivities',
        'joinsTravels',
        'joinsTravels.usersTravelers',
        'joinsTravels.travelActivities',
        'reviewsCreated',
        'reviewsCreated.receivedUserBy',
        'reviewsCreated.travel',
        'reviewsReceived',
        'reviewsReceived.createdUserBy',
        'userActivities',
        'items',
      ],
    });

    return user
  }

  async joinToTravel(travel: Travel, userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('This user does not exist');
    }
    user.joinsTravels = user.joinsTravels || [];
    user.joinsTravels.push(travel);
    return this.userRepository.save(user);
  }

  async createToTravel(travel: Travel, userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('This user does not exist');
    }
    user.joinsTravels = user.joinsTravels || [];
    user.travelsCreated = user.travelsCreated || [];
    user.travelsCreated.push(travel);
    user.joinsTravels.push(travel);
    return this.userRepository.save(user);
  }

  async leaveTravel(travel: Travel, user: User) {
    user.joinsTravels = user.joinsTravels.filter(
      (trav) => trav.id !== travel.id,
    );
    this.userRepository.save(user);
  }
  async assignReview(review: Review, userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('This user not exist');
    }
    user.reviewsCreated = user.reviewsCreated || [];
    user.reviewsCreated.push(review);
    return this.userRepository.save(user);
  }

  async receiveReview(review: Review, userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('This user not exist');
    }
    user.reviewsReceived = user.reviewsReceived || [];
    user.reviewsReceived.push(review);
    return this.userRepository.save(user);
  }

  async assingItem(item: Item, userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('this user not exist');
    }
    user.items = user.items || [];
    user.items.push(item);
    this.userRepository.save(user);
  }

  async removeItem(item: Item, user: User): Promise<void> {
    user.items = user.items.filter((it) => it.id !== item.id);
    this.userRepository.save(user);
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`There is no user with that ID: ${id}`);
    }

    Object.assign(user, updateUserInput);

    if (updateUserInput.activitiesIds) {
      const uniqueActivityIds = [...new Set(updateUserInput.activitiesIds)];
      const activities =
        await this.activityService.findActivitiesById(uniqueActivityIds);
      user.userActivities = activities;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.userRepository.clear();
  }

  async save(user: User): Promise<void> {
    this.userRepository.save(user);
  }

  //**********CHAT********** *//
  async sendMessage(createMessageInput: CreateMessageInput, userId: string, chatId: string): Promise<Message> {
    const user = await this.findById(userId);
    if (!user) {
      throw new GraphQLError('this user not exist');
    }

    const chat = await this.chatService.findOne(chatId);

    const travel = user.joinsTravels.find(tr => tr.id === chat.travel.id);

    if (!travel) {
      throw new GraphQLError('The user is not part of this travel');
    }

    if(!travel.usersTravelers.some(us => us.id === user.id)){
      throw new GraphQLError('You dont belong on this journey');
    }

    return await this.chatService.sendMessage(createMessageInput, chatId, user)
  }


  //*********************** *//
}
