import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistResolver } from './checklist.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './entities/checklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checklist]),
  ],
  providers: [ChecklistResolver, ChecklistService],
})
export class ChecklistModule {}
