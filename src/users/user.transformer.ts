import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserTransformer {
  async toDto(user: User): Promise<UserDto> {
    const userDto = new UserDto();
    Object.assign(userDto, user);
    if (!user || !user.reviewsReceived || user.reviewsReceived.length === 0) {
        userDto.totalReviews = 0; 
        return userDto;
    }
    const totalScore = user.reviewsReceived.reduce(
      (sum, review) => sum + parseInt(review.stars, 10),
      0,
    );
    userDto.totalReviews = totalScore / userDto.reviewsReceived.length;
    return userDto;
  }

  async toDtos(users: User[]): Promise<UserDto[]> {
    const usersDto: UserDto[]  = [];
    for(const user of users){
        const newUserDto = await this.toDto(user)
        usersDto.push(newUserDto)
    }
    return usersDto;
  }

  async toEntity(userDto: UserDto): Promise<User> {
    const user = new User();
    Object.assign(user, userDto);
    return user;
  }
}
