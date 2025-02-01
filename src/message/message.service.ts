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



  async findMenssagesOfChat(chatId: string):Promise<Message[]>{
    const query = await this.messageRepository.createQueryBuilder('message');

    query.leftJoinAndSelect('message.chat', 'chat')
    .leftJoinAndSelect('message.user', 'user')

    query.andWhere('chat.id = :chatId', {chatId});

    const messages = query.getMany();
    return messages;
  }

  async findOne(id: string):Promise<Message>{
    return await this.messageRepository.findOne({
      where: {id},
      relations: [
        'chat',
        'user'
      ]
    })
  }

  async editMessage(updateMessageInput: UpdateMessageInput, messageId: string, user: User):Promise<Message>{
    const message = await this.findOne(messageId);
    if(!message){
      throw new Error(`This message not exist`);
    }

    if(message.user.id != user.id){
      throw new Error(`Only the creator cant edit the message`);
    }

    Object.assign(message, updateMessageInput);
    message.wasEdited = true
    return this.messageRepository.save(message);

  }

  async delete(messageId:string):Promise<void>{
    await this.messageRepository.delete(messageId)
  }

}
