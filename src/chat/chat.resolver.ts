import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Message } from '../message/entities/message.entity';
import { CreateMessageInput } from '../message/dto/create-message.input';

@Resolver(() => Chat)
@UseGuards(JwtAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Query(() => [Chat], { name: 'chats' })
  async findAll() {
    return await this.chatService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.chatService.findOne(id);
  }


  @Query(() => [Chat], {name: 'chatUser'})
  async findChatsOfUser(
    @Context() context 
  ){
    return await this.chatService.findAllChatsOfUser(context.req.user.userId)
  }


}
