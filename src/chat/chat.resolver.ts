import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Resolver(() => Chat)
@UseGuards(JwtAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) { }

  @Query(() => [Chat], { name: 'chats' })
  async findAll() {
    return await this.chatService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.chatService.findOne(id);
  }


  @Query(() => [Chat], { name: 'chatUser' })
  async findChatsOfUser(
    @Context() context
  ) {
    return await this.chatService.findAllChatsOfUser(context.req.user.userId)
  }

  @Query(() => Chat, { name: 'findChatByTravelId' })
  async findChatByTravelId(
    @Args('travelId', { type: () => String }) travelId: string
  ) {
    return await this.chatService.findChatByTravelId(travelId)
  }


}
