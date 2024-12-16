import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';

@Resolver(() => Chat)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => Chat)
  createChat(@Args('createChatInput') createChatInput: CreateChatInput) {
<<<<<<< HEAD
    return this.chatService.create();
=======
    return this.chatService.create(createChatInput);
>>>>>>> bbc90cbcf59be72c96ed6a2a7e28c934c242a184
  }

  @Query(() => [Chat], { name: 'chat' })
  findAll() {
    return this.chatService.findAll();
  }

  @Query(() => Chat, { name: 'chat' })
<<<<<<< HEAD
  findOne(@Args('id', { type: () => String }) id: string) {
=======
  findOne(@Args('id', { type: () => Int }) id: number) {
>>>>>>> bbc90cbcf59be72c96ed6a2a7e28c934c242a184
    return this.chatService.findOne(id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatService.remove(id);
  }
}
