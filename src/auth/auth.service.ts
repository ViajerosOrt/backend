import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SignupUserInput } from './dto/signup-user.input';
import * as bcrypt from 'bcrypt'
import { AuthenticationError } from '@nestjs/apollo';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (!user) {
      throw new AuthenticationError('User does not exist.')
    }

    // Validate the given password is correct 
    const isValid = await bcrypt.compare(password, user?.password)

    if (!isValid) {
      throw new AuthenticationError('The Password is not correct.')
    }

    const { password: notReturnedPassword, ...result } = user

    return result
  }

  // Login mutation.
  // Validates the given password + email and returns a JWT, which is used for authenticating future requests.
  async login(user: User) {
    // Returns an JWT + the user.
    const token = this.jwtService.sign({ username: user.email, sub: user.id })

    const decodedToken = this.jwtService.decode(token);
    const validForSeconds = decodedToken.exp - Math.floor(Date.now() / 1000)
    const validUntil = new Date(decodedToken.exp * 1000).toISOString();

    return {
      accessToken: {
        value: token,
        validForSeconds,
        validUntil

      },
      user: user
    }
  }

  // Signup mutation.
  // Validates the user does not exists, and creates a new one with a hashed password.
  async signup(signupUserInput: SignupUserInput) {
    // TODO: Remove this, try to insert and blow up wit the unique constraint
    const user = await this.usersService.findByEmail(signupUserInput.email)

    if (user) {
      throw new GraphQLError('User already exists')
    }

    // We store a hashed password
    const hashedPassword = await bcrypt.hash(signupUserInput.password, 10)

    return this.usersService.create({
      ...signupUserInput,
      password: hashedPassword
    })
  }
}
