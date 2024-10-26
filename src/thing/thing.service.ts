import { Injectable } from '@nestjs/common';
import { CreateThingInput } from './dto/create-thing.input';
import { UpdateThingInput } from './dto/update-thing.input';

@Injectable()
export class ThingService {
  create(createThingInput: CreateThingInput) {
    return 'This action adds a new thing';
  }

  findAll() {
    return `This action returns all thing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thing`;
  }

  update(id: number, updateThingInput: UpdateThingInput) {
    return `This action updates a #${id} thing`;
  }

  remove(id: number) {
    return `This action removes a #${id} thing`;
  }
}
