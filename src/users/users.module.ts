import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ActivitesModule } from 'src/activites/activites.module';
import { IsAdult } from 'src/validators/is-adult.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivitesModule],
  providers: [UsersResolver, UsersService, IsAdult],
  exports: [UsersService]
})
export class UsersModule {}
