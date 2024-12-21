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

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private messageService: MessageService
  ){}


  async create(): Promise<Chat> {
    const chat = this.chatRepository.create();
    return this.chatRepository.save(chat);
  }

  async addUserToChat(chatId: string, user: User):Promise<Chat>{
    const chat = await this.findOne(chatId)
    chat.users = chat.users || []
    chat.users.push(user)
    return this.chatRepository.save(chat)
  }

  async findAll():Promise<Chat[]> {
    const query = await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'users')
    .leftJoinAndSelect('chat.messages', 'messages')
    .leftJoinAndSelect('messages.user', 'userMessage')
    
    const chats = query.getMany();
    return chats;
  }

  async findOne(id: string):Promise<Chat> {
    return this.chatRepository.findOne({
      where:{
        id
      },
      relations:[
        'travel',
        'users',
        'messages',
        'messages.user'
      ]
    });

  }

  async findAllChatsOfUser(userId: string):Promise<Chat[]> {
    const query = await this.chatRepository
    .createQueryBuilder('chat')
    .leftJoinAndSelect('chat.users', 'users')
    .leftJoinAndSelect('chat.messages', 'messages')
    .leftJoinAndSelect('messages.user', 'userMessage')
    
    query.andWhere('users.id = :userId', {userId} );

    const chats = query.getMany();
    return chats;
  }
  
  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async save(chat: Chat):Promise<Chat>{
    return this.chatRepository.save(chat);
  }

 async sendMenssage(createMessageInput: CreateMessageInput, chatId: string, user: User):Promise<Message> {
    const chat = await this.findOne(chatId);
    const newMessage = await this.messageService.create(createMessageInput, user, chat);
    chat.messages = chat.messages || [];
    chat.messages.push(newMessage)
    this.chatRepository.save(chat);
    return newMessage;
  }
}
