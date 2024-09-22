import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (user && user.password == password) { // TODO MAkE THIS MORE SECURE
      const { password, ...result } = user
      return result
    }

    return null
  }

  // Login mutation.
  // Validates the given password + email and returns a JWT, which is used for authenticating future requests.
  async login(user: User) {
    // Returns an JWT + the user.
    return {
      access_token: this.jwtService.sign({ username: user.email, sub: user.id }),
      user: user
    }
  }

  async signup
}
