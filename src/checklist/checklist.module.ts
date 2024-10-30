import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { ChecklistResolver } from './checklist.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist } from './entities/checklist.entity';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checklist]),
    ItemModule
  ],
  providers: [ChecklistResolver, ChecklistService],
  exports: [ChecklistService]
})
export class ChecklistModule {}
