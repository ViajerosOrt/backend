import { Module } from '@nestjs/common';
import { ActivitesService } from './activites.service';
import { ActivitesResolver } from './activites.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activite } from './activites.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activite])],
  providers: [ActivitesService, ActivitesResolver],
  exports: [ActivitesService],
})
export class ActivitesModule {}
