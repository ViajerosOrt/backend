import { Injectable } from '@nestjs/common';
import { CreateChecklistInput } from './dto/create-checklist.input';
import { UpdateChecklistInput } from './dto/update-checklist.input';
import { Checklist } from './entities/checklist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Travel } from '../travel/entities/travel.entity';
import { ItemService } from '../item/item.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
    private itemService: ItemService,
  ) {}

  async create(travelId: string, items: string[]) {
    const checklistIntput = new CreateChecklistInput();
    checklistIntput.name = 'checklist ';
    const checklist = this.checklistRepository.create(checklistIntput);
    return await this.checklistRepository.save(checklist);
  }

  async createChecklist(travel: Travel, items: string[]): Promise<Checklist> {
    if (!travel) {
      throw new  GraphQLError('Travel cannot be null.');
    }

    if (!items || items.length === 0) {
      throw new GraphQLError('Items must not be empty.');

    }

    const checklistIntput = new CreateChecklistInput();
    checklistIntput.name = 'checklist ' + travel.travelTitle;
    const checklist = this.checklistRepository.create(checklistIntput);
    checklist.travel = travel;
    checklist.items = checklist.items || [];
    checklist.items = await this.itemService.createAllItems(items);
    return this.checklistRepository.save(checklist);
  }

  async addItems(checklistId: string, items: string[]): Promise<Checklist> {
    const newItems = await this.itemService.createAllItems(items);
    const checklist = await this.findOne(checklistId);
    if(!checklist){
      throw new GraphQLError('No checklist found');
    }
    checklist.items = checklist.items || [];
    checklist.items.push(...newItems);
    return this.checklistRepository.save(checklist);
  }

  async removeItems(checklistId: string, itemsId: string[]):Promise<Checklist>{
    const checklist = await this.findOne(checklistId);
    if(!checklist){
      throw new GraphQLError('No checklist found');
    }
    checklist.items = checklist.items.filter(item => !itemsId.includes(item.id))
    return this.checklistRepository.save(checklist)
  }

  async assingItemToUser(checklistId: string,userId: string, itemId: string):Promise<void>{
    const checklist = await this.findOne(checklistId);
    if(!checklist){
      throw new GraphQLError('No checklist found');
    }

    this.itemService.addUser(itemId, userId);
  }

  findAll() {
    return `This action returns all checklist`;
  }

  async findOne(id: string) {
    return await this.checklistRepository.findOne({
      where: {
        id,
      },
      relations: ['items'],
    });
  }

  update(id: string, updateChecklistInput: UpdateChecklistInput) {
    return `This action updates a #${id} checklist`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklist`;
  }
}
