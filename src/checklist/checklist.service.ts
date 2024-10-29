import { Injectable } from '@nestjs/common';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';

@Injectable()
export class ChecklistService {
  create(createChecklistInput: CreateChecklistInput) {
    return 'This action adds a new checklist';
  }

  findAll() {
    return `This action returns all checklist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checklist`;
  }

  update(id: string, updateChecklistInput: UpdateChecklistInput) {
    return `This action updates a #${id} checklist`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklist`;
  }
}
