import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { SignupUserInput } from './dto/signup-user.input';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context
  ) {
    return await this.authService.login(context.user)
  }

  @Mutation(() => User)
  async signup(@Args('signupUserInput') signupUserInput: SignupUserInput): Promise<User> {
    return await this.authService.signup(signupUserInput)
  }
}
