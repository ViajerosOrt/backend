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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) { }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async addActivities(
    @Args('userId') userId: number,
    @Args({ name: 'activitiesIds', type: () => [Number] })
    activitiesIds: number[],
  ): Promise<User> {
    return await this.usersService.addActivity(userId, activitiesIds);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  async findAll(@Context() context): Promise<User[]> {
    console.log(context.req);
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findById(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Query(() => User, { name: 'user' })
  findByEmail(@Args('email', { type: () => String }) email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('userId') userId: number,
  ) {
    return this.usersService.update(userId, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
