import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async addActivities(
    @Args('userId') userId: number,
    @Args({ name: 'activitiesIds', type: () => [Number] })
    activitiesIds: number[],
  ): Promise<User> {
    return await this.usersService.addActivity(userId, activitiesIds);
  }

  @Query((returns) => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query((returns) => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation((returns) => User)
  update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('userId') userId: number,
  ) {
    return this.usersService.update(userId, updateUserInput);
  }

  @Mutation((returns) => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
