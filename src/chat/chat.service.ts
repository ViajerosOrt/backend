import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateMessageInput } from '../message/dto/create-message.input';
import { MessageService } from '../message/message.service';
import { use } from 'passport';
import { Message } from '../message/entities/message.entity';
import { UpdateMessageInput } from '../message/dto/update-message.input';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private messageService: MessageService
  ) { }


  async create(): Promise<Chat> {
    const chat = this.chatRepository.create();
    return this.chatRepository.save(chat);
  }

  async addUserToChat(chatId: string, user: User): Promise<Chat> {
    const chat = await this.findOne(chatId)
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    chat.users = chat.users || []
    chat.users.push(user)
    console.log(chat.users)
    return this.chatRepository.save(chat)
  }

  async removeUserToChat(chatId: string, user: User): Promise<Chat> {
    const chat = await this.findOne(chatId)
    if (!chat) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    chat.users = chat.users.filter(us => us.id !== user.id)
    return this.chatRepository.save(chat)
  }

  async findAll(): Promise<Chat[]> {
    const query = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.travel', 'travel')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'userMessage')

    const chats = query.getMany();
    return chats;
  }

  async findOne(id: string): Promise<Chat> {
    return this.chatRepository.findOne({
      where: {
        id
      },
      relations: [
        'travel',
        'users',
        'users.reviewsCreated',
        'users.reviewsCreated.receivedUserBy',
        'users.reviewsCreated.travel',
        'users.reviewsReceived',
        'users.reviewsReceived.createdUserBy',
        'users.reviewsReceived.travel',
        'users.userActivities',
        'users.travelsCreated',
        'messages',
        'messages.user'
      ]
    });

  }

  async findAllChatsOfUser(userId: string): Promise<Chat[]> {
    const query = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.users', 'filterUser', 'filterUser.id = :userId', {
        userId,
      })
      .leftJoinAndSelect('chat.travel', 'travel')
      .leftJoinAndSelect('chat.users', 'allUsers')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'userMessage')


    const chats = query.getMany();
    return chats;
  }

  async findAllChatsOsTravleId(travelId: string): Promise<Chat[]> {
    const query = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.travel', 'travel')
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'userMessage')

    query.andWhere('travel.id = :travelId', {travelId});
    const chats = query.getMany();
    return chats;
  }

  async save(chat: Chat): Promise<Chat> {
    return this.chatRepository.save(chat);
  }

  async sendMessage(createMessageInput: CreateMessageInput, chatId: string, user: User): Promise<Message> {
    const chat = await this.findOne(chatId);
    if (!await this.isMember(chatId, user)) {
      throw new Error(`This user is not a member`);
    }
    const newMessage = await this.messageService.create({ ...createMessageInput, createdAt: new Date() }, user, chat);
    chat.messages = chat.messages || [];
    chat.messages.push(newMessage)
    this.chatRepository.save(chat);
    return newMessage;
  }

  async isMember(chatId: string, user: User): Promise<boolean> {
    const chat = await this.findOne(chatId);
    const userFind = chat.users.some(us => us.id === user.id)
    return userFind;
  }

  async editMessage(updateMessageInput: UpdateMessageInput,messageId: string, chat: Chat, user: User){
    if (!await this.isMember(chat.id, user)) {
      throw new Error(`This user is not a member`);
    }
    return await this.messageService.editMessage(updateMessageInput,messageId,user)
  }
}
