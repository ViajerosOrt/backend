import { Resolver, Query, Mutation, Args, Int, ResolveField } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Activite } from 'src/activites/activites.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput):Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async addActivites(
    @Args('userId') userId: number,
    @Args({name: 'actividadIds', type: () => [Number]}) actividadIds: number[]
  ): Promise<User> {
    return await this.usersService.agregarActividad(userId, actividadIds);
  }

  @Query((returns) => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query((returns) => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
   
  }

  @Query((returns) => User, { name: 'getUserActivites' })
  async findActivites(@Args('id', { type: () => Int }) id: number): Promise<Activite[]> {
    return await this.usersService.getActivites(id);
  }

  @Mutation((returns) => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation((returns) => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
