import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsAdult } from '../validators/is-adult.validator';
import { ActivityModule } from '../activity/activity.module';
import { TravelModule } from '../travel/travel.module';
import { ChatModule } from '../chat/chat.module';
import { UserTransformer } from './user.transformer';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivityModule, ChatModule],
  providers: [UsersResolver, UsersService, IsAdult, UserTransformer],
  exports: [UsersService]
})
export class UsersModule { }
