import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsAdult } from 'src/validators/is-adult.validator';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivityModule],
  providers: [UsersResolver, UsersService, IsAdult],
  exports: [UsersService]
})
export class UsersModule { }
