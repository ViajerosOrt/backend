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

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @Context() context,
    @Args('chatId', {type: () => String}) chatId:string
  ) {
    return "";
  }

  @Query(() => [Message], {name: 'messagesChat'})
  async findMenssagesOfChat(
    @Args('chatId', {type: () => String}) chatId:string
  ){
    return await this.messageService.findMenssagesOfChat(chatId);
  }

  @Query(() => [Message], { name: 'messages' })
  findAll() {
    return this.messageService.findAll();
  }

  @Query(() => Message, { name: 'message' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.findOne(id);
  }

  @Mutation(() => Message)
  updateMessage(@Args('updateMessageInput') updateMessageInput: UpdateMessageInput) {
    return this.messageService.update(updateMessageInput.id, updateMessageInput);
  }

  @Mutation(() => Message)
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.remove(id);
  }
}
