import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Message)
@UseGuards(JwtAuthGuard)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}


  @Query(() => [Message], {name: 'messagesChat'})
  async findMenssagesOfChat(
    @Args('chatId', {type: () => String}) chatId:string
  ){
    return await this.messageService.findMenssagesOfChat(chatId);
  }

  @Mutation(() => Message, {name: 'editMessage'})
  async editMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
    @Args('messageId') messageId: string,
    @Context() context,
  ):Promise<Message>{
    return await this.messageService.editMessage(updateMessageInput,messageId,context.req.user.userId);
  }



}
