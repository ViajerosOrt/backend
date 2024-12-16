import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';
import { MyGateway } from '../gateway/gateway';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly gateway: MyGateway
  ){}

  async create(createMessageInput: CreateMessageInput, user: User, chat: Chat):Promise<Message> {
    const message = this.messageRepository.create(createMessageInput);
    message.chat = chat;
    message.user = user;
    this.gateway.server.to(chat.id).emit('newMessage', {chatId: chat.id, message: message.content})
    return this.messageRepository.save(message)
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
