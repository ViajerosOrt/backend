import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private userService: UsersService
  ){}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = this.itemRepository.create(createItemInput);
    console.log(item)
    return this.itemRepository.save(item);
  }

  async createAllItems(items: string[]): Promise<Item[]> {
    if (!items || items.length === 0) {
      throw new Error('Items array must not be empty');
    }

    const itemEntities = items.map(item => {
      const createItemInput = new CreateItemInput();
      createItemInput.name = item;
      createItemInput.isEndable = false;
      return this.itemRepository.create(createItemInput);
    });

    return this.itemRepository.save(itemEntities);
  }

  async addUser(itemId: string, userId: string):Promise<void>{
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('This user does not exist');
    }
    const item = await this.findOne(itemId);
    item.user = user
    item.state = true
    this.itemRepository.save(item)
  }


  findAll() {
    return `This action returns all item`;
  }

  async findOne(id: string) {
    return await this.itemRepository.findOne({
      where: {
        id
      },
      relations:['user']
    });
  }

  update(id: string, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
