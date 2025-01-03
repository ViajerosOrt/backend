import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Message } from '../message/entities/message.entity';
import { CreateMessageInput } from '../message/dto/create-message.input';
import { UserDto } from './dto/user.dto';
import { UserTransformer } from './user.transformer';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService,
    private readonly userTransformer: UserTransformer
  ) { }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async addActivities(
    @Args({ name: 'activitiesIds', type: () => [String] })
    @Context() context,
    activitiesIds: String[],
  ): Promise<User> {
    const user = await this.usersService.addActivity(context.req.user.userId, activitiesIds);
    return user;
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Query(() => User, { name: 'userById' })
  @UseGuards(JwtAuthGuard)
  async findById(@Args('id', { type: () => String }) id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    return user;
  }

  @Query(() => UserDto, { name: 'getUserSocre' })
  @UseGuards(JwtAuthGuard)
  async getUserSocre(@Args('id', { type: () => String }) id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    return await this.userTransformer.toDto(user);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    const user = await this.usersService.update(context.req.user.userId, updateUserInput);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @Mutation(() => Message, { name: 'sendMessage' })
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @Context() context,
    @Args('chatId') chatId: string
  ): Promise<Message> {
    return this.usersService.sendMessage(createMessageInput, context.req.user.userId, chatId);
  }


}
