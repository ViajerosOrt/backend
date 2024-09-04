import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ActivitesModule } from 'src/activites/activites.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ActivitesModule],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
